import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
  const payload = await getPayloadClient()

  const [services, developers, posts] = await Promise.all([
    payload.find({
      collection: 'services',
      where: { status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
    }),
    payload.find({
      collection: 'developers',
      where: { status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
    }),
    payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
    }),
  ])

  const staticRoutes = ['', '/services', '/superheroes', '/about', '/insights', '/contact']
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.7,
  }))

  const serviceEntries: MetadataRoute.Sitemap = services.docs.map((service) => ({
    url: new URL(`/services/${encodeURIComponent(service.slug)}`, siteUrl).toString(),
    lastModified: service.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const developerEntries: MetadataRoute.Sitemap = developers.docs.map((developer) => ({
    url: new URL(`/superheroes/${encodeURIComponent(developer.slug)}`, siteUrl).toString(),
    lastModified: developer.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  const postEntries: MetadataRoute.Sitemap = posts.docs.map((post) => ({
    url: new URL(`/insights/${encodeURIComponent(post.slug)}`, siteUrl).toString(),
    lastModified: post.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticEntries, ...serviceEntries, ...developerEntries, ...postEntries]
}
