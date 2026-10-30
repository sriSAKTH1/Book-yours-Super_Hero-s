import type { MetadataRoute } from 'next'
import { getPublicSiteURL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  const siteURL = getPublicSiteURL()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    ...(siteURL ? { sitemap: new URL('/sitemap.xml', siteURL).toString() } : {}),
  }
}
