import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { mkdir, open, readFile, unlink } from 'node:fs/promises'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { seoPlugin } from '@payloadcms/plugin-seo'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { searchPlugin } from '@payloadcms/plugin-search'
import { getSearchExcerpt, getSearchResultURL, isPublishedSearchDocument } from './lib/searchIndex'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Developers } from './collections/Developers'
import { Posts } from './collections/Posts'
import { Pages } from './collections/Pages'
import { ContactInquiries } from './collections/ContactInquiries'
import { ConsultationRequests } from './collections/ConsultationRequests'
import { NewsletterSubscribers } from './collections/NewsletterSubscribers'

import { AboutBlock } from './blocks/About'
import { CallToActionBlock } from './blocks/CallToAction'
import { FAQsBlock } from './blocks/FAQs'
import { HeroBlock } from './blocks/Hero'
import { ImageTextBlock } from './blocks/ImageText'
import { PostsBlock } from './blocks/Posts'
import { ServicesBlock } from './blocks/Services'
import { SuperheroesBlock } from './blocks/Superheroes'

import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { FirmSettings } from './globals/FirmSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const globalForMongo = globalThis as typeof globalThis & {
  payloadMemoryServer?: Promise<{ databaseUrl: string; server?: MongoMemoryServer }>
}

async function canConnectToMongo(url: string, timeoutMS: number) {
  try {
    await mongoose.connect(url, { serverSelectionTimeoutMS: timeoutMS })
    await mongoose.disconnect()
    return true
  } catch {
    return false
  }
}

function isProcessRunning(pid: number) {
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === 'EPERM'
  }
}

async function removeStaleMongoLock(dbPath: string) {
  const mongoLockPath = path.join(dbPath, 'mongod.lock')

  try {
    const lockContents = (await readFile(mongoLockPath, 'utf8')).trim()
    const ownerPid = Number.parseInt(lockContents, 10)

    // Never remove MongoDB's lock unless its recorded owner is confirmed gone.
    if (!Number.isInteger(ownerPid) || ownerPid <= 0 || isProcessRunning(ownerPid)) return

    await unlink(mongoLockPath)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }
}

async function startOrJoinMemoryServer(databaseName: string, databaseUrl: string) {
  const dataDirectory = path.resolve(dirname, '../.data')
  const dbPath = path.join(dataDirectory, 'mongodb')
  const lockPath = path.join(dataDirectory, 'mongodb-start.lock')
  const deadline = Date.now() + 60_000

  await mkdir(dataDirectory, { recursive: true })

  while (Date.now() < deadline) {
    if (await canConnectToMongo(databaseUrl, 500)) {
      return { databaseUrl }
    }

    let lock
    let keepStartupLock = false
    try {
      lock = await open(lockPath, 'wx')
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error

      try {
        const ownerPid = Number.parseInt(await readFile(lockPath, 'utf8'), 10)
        if (Number.isInteger(ownerPid) && ownerPid > 0 && !isProcessRunning(ownerPid)) {
          await unlink(lockPath)
          continue
        }
      } catch (lockError) {
        if ((lockError as NodeJS.ErrnoException).code === 'ENOENT') continue
        throw lockError
      }

      await new Promise((resolve) => setTimeout(resolve, 250))
      continue
    }

    try {
      await lock.writeFile(String(process.pid))
      await removeStaleMongoLock(dbPath)

      if (await canConnectToMongo(databaseUrl, 500)) {
        return { databaseUrl }
      }

      const server = await MongoMemoryServer.create({
        instance: {
          dbName: databaseName,
          dbPath,
          ip: '127.0.0.1',
          port: 27017,
          storageEngine: 'wiredTiger',
        },
      })
      const memoryDatabaseUrl = server.getUri(databaseName)
      // Keep the inter-process lock for as long as this process owns mongod.
      // Releasing it immediately lets another Next.js worker start a second
      // mongod against the same persistent dbPath before the first is visible.
      keepStartupLock = true
      console.warn(`Local MongoDB is unavailable; using persistent project MongoDB at ${memoryDatabaseUrl}`)
      return { databaseUrl: memoryDatabaseUrl, server }
    } finally {
      await lock.close()
      if (!keepStartupLock) {
        try {
          await unlink(lockPath)
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
        }
      }
    }
  }

  throw new Error(`Timed out waiting for MongoDB startup at ${databaseUrl}`)
}

async function resolveDatabaseUrl() {
  const configuredUrl = process.env.DATABASE_URL || 'mongodb://127.0.0.1/payload-project1'
  const configuredDatabaseName = decodeURIComponent(new URL(configuredUrl).pathname.replace(/^\/+/, '')) || 'payload-project1'

  if (process.env.USE_MEMORY_DB === 'false') {
    return configuredUrl
  }

  const isLocalMongoUrl = configuredUrl.includes('127.0.0.1') || configuredUrl.includes('localhost')

  if (!isLocalMongoUrl) {
    return configuredUrl
  }

  if (await canConnectToMongo(configuredUrl, 1500)) {
    return configuredUrl
  }

  globalForMongo.payloadMemoryServer ??= startOrJoinMemoryServer(configuredDatabaseName, configuredUrl)
  const memoryServer = await globalForMongo.payloadMemoryServer
  return memoryServer.databaseUrl
}

const databaseUrl = await resolveDatabaseUrl()

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: 'light',
    meta: {
      titleSuffix: '- Superhero HQ Admin',
      icons: {
        icon: '/assets/superhero-hq-icon.svg',
      },
    },
    components: {
      graphics: {
        Logo: '/components/admin/graphics/Logo',
        Icon: '/components/admin/graphics/Icon',
      },
      beforeLogin: ['@/components/admin/SuperheroLoginBrand#SuperheroLoginBrand'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Services, Developers, Posts, Pages, ContactInquiries, ConsultationRequests, NewsletterSubscribers],
  blocks: [HeroBlock, ImageTextBlock, PostsBlock, AboutBlock, FAQsBlock, ServicesBlock, SuperheroesBlock, CallToActionBlock],
  globals: [Header, Footer, FirmSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: databaseUrl,
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['pages', 'services', 'developers', 'posts'],
      uploadsCollection: 'media',
      tabbedUI: true,
    }),
    formBuilderPlugin({
      fields: {
        payment: false,
      },
    }),
    searchPlugin({
      collections: ['pages', 'services', 'developers', 'posts'],
      defaultPriorities: { pages: 5, services: 10, developers: 15, posts: 20 },
      syncDrafts: false,
      deleteDrafts: true,
      skipSync: async ({ collectionSlug, doc, req }) => {
        const record = doc as Record<string, unknown>
        const isPublic = isPublishedSearchDocument(collectionSlug, record)
        const hasRoute = Boolean(getSearchResultURL(collectionSlug, record))

        if (isPublic && hasRoute) return false

        // These collections use a custom `status` field rather than Payload drafts.
        // Remove an existing index entry when a document is unpublished.
        const { docs } = await req.payload.find({
          collection: 'search',
          depth: 0,
          limit: 100,
          overrideAccess: true,
          req,
          where: {
            and: [
              { 'doc.relationTo': { equals: collectionSlug } },
              { 'doc.value': { equals: String(record.id) } },
            ],
          },
        })

        await Promise.all(docs.map((searchDoc) => req.payload.delete({
          collection: 'search',
          id: searchDoc.id,
          overrideAccess: true,
          req,
        })))

        return true
      },
      beforeSync: ({ collectionSlug, originalDoc, searchDoc }) => ({
        ...searchDoc,
        title: typeof originalDoc.title === 'string'
          ? originalDoc.title
          : typeof originalDoc.name === 'string' ? originalDoc.name : 'Untitled',
        excerpt: getSearchExcerpt(collectionSlug, originalDoc),
        url: getSearchResultURL(collectionSlug, originalDoc) ?? '/',
      }),
      searchOverrides: {
        fields: ({ defaultFields }) => [
          ...defaultFields,
          { name: 'excerpt', type: 'textarea', admin: { readOnly: true } },
          { name: 'url', type: 'text', admin: { readOnly: true } },
        ],
      },
    }),
  ],
})
