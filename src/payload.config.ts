import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { mkdir } from 'node:fs/promises'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

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
import { SiteDesign } from './globals/SiteDesign'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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

  try {
    await mongoose.connect(configuredUrl, { serverSelectionTimeoutMS: 1500 })
    await mongoose.disconnect()
    return configuredUrl
  } catch {
    const dbPath = path.resolve(dirname, '../.data/mongodb')
    await mkdir(dbPath, { recursive: true })
    const memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: configuredDatabaseName,
        dbPath,
        ip: '127.0.0.1',
        port: 27017,
        storageEngine: 'wiredTiger',
      },
    })
    console.warn('Local MongoDB is unavailable; using persistent project MongoDB at mongodb://127.0.0.1:27017/payload-project1')
    return memoryServer.getUri(configuredDatabaseName)
  }
}

const databaseUrl = await resolveDatabaseUrl()

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Services, Developers, Posts, Pages, ContactInquiries, ConsultationRequests, NewsletterSubscribers],
  blocks: [HeroBlock, ImageTextBlock, PostsBlock, AboutBlock, FAQsBlock, ServicesBlock, SuperheroesBlock, CallToActionBlock],
  globals: [Header, Footer, FirmSettings, SiteDesign],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: databaseUrl,
  }),
  sharp,
  plugins: [],
})
