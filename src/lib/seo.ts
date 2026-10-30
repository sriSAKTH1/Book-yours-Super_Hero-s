import type { Metadata } from 'next'
import { cache } from 'react'
import type { Developer, Page, Post, Service } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'

type SeoFields = {
  title?: string | null
  description?: string | null
  image?: string | { url?: string | null; alt?: string | null; width?: number | null; height?: number | null } | null
}

type MetadataInput = {
  title?: string | null
  description?: string | null
  image?: SeoFields['image']
  legacyTitle?: string | null
  legacyDescription?: string | null
  fallbackTitle: string
  fallbackDescription: string
  pathname: string
  type?: 'website' | 'article'
}

export function getPublicSiteURL(): URL | null {
  const configuredURL = process.env.NEXT_PUBLIC_SITE_URL
  if (configuredURL) {
    try {
      return new URL(configuredURL)
    } catch {
      return null
    }
  }

  return process.env.NODE_ENV === 'development' ? new URL('http://localhost:3000') : null
}

export function createDocumentMetadata(input: MetadataInput): Metadata {
  const siteURL = getPublicSiteURL()
  const image = input.image && typeof input.image === 'object' ? input.image : null
  let imageURL: string | undefined

  if (siteURL && image?.url) {
    try {
      imageURL = new URL(image.url, siteURL).toString()
    } catch {
      imageURL = undefined
    }
  }

  const title = input.title || input.legacyTitle || input.fallbackTitle
  const description = input.description || input.legacyDescription || input.fallbackDescription
  const canonicalURL = siteURL ? new URL(input.pathname, siteURL).toString() : undefined

  return {
    title,
    description,
    ...(canonicalURL ? { alternates: { canonical: canonicalURL } } : {}),
    openGraph: {
      type: input.type || 'website',
      title,
      description,
      ...(canonicalURL ? { url: canonicalURL } : {}),
      ...(imageURL ? {
        images: [{
          url: imageURL,
          ...(image?.alt ? { alt: image.alt } : {}),
          ...(image?.width ? { width: image.width } : {}),
          ...(image?.height ? { height: image.height } : {}),
        }],
      } : {}),
    },
    twitter: {
      card: imageURL ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(imageURL ? { images: [imageURL] } : {}),
    },
  }
}

export const getPublicPageByType = cache(async (pageType: Page['pageType']) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { pageType: { equals: pageType } },
        { or: [{ _status: { equals: 'published' } }, { status: { equals: 'published' } }] },
      ],
    },
    limit: 1,
    depth: 1,
  })
  return result.docs[0] || null
})

export const getPublicPageBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { slug: { equals: slug } },
        { or: [{ _status: { equals: 'published' } }, { status: { equals: 'published' } }] },
      ],
    },
    limit: 1,
    depth: 1,
  })
  return result.docs[0] || null
})

export const getPublishedService = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] || null
})

export const getPublishedDeveloper = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'developers',
    where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] || null
})

export const getPublishedPost = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] || null
})

export function pageMetadata(page: Page | null, pathname: string, fallbackTitle: string, fallbackDescription: string) {
  return createDocumentMetadata({
    title: page?.meta?.title,
    description: page?.meta?.description,
    image: page?.meta?.image,
    fallbackTitle: page?.title || fallbackTitle,
    fallbackDescription: page?.heroDescription || fallbackDescription,
    pathname,
  })
}

export function serviceMetadata(service: Service | null, pathname: string) {
  return createDocumentMetadata({
    title: service?.meta?.title,
    description: service?.meta?.description,
    image: service?.meta?.image,
    fallbackTitle: service?.title || 'Hero services',
    fallbackDescription: service?.shortDescription || 'Explore services from Superhero HQ.',
    pathname,
  })
}

export function developerMetadata(developer: Developer | null, pathname: string) {
  return createDocumentMetadata({
    title: developer?.meta?.title,
    description: developer?.meta?.description,
    image: developer?.meta?.image,
    fallbackTitle: developer?.name || 'Meet the superheroes',
    fallbackDescription: developer?.jobTitle || 'Meet the heroes protecting our community.',
    pathname,
  })
}

export function postMetadata(post: Post | null, pathname: string) {
  return createDocumentMetadata({
    title: post?.meta?.title,
    description: post?.meta?.description,
    image: post?.meta?.image,
    fallbackTitle: post?.title || 'Superhero HQ insights',
    fallbackDescription: post?.excerpt || 'Updates and stories from the Superhero HQ network.',
    pathname,
    type: 'article',
  })
}
