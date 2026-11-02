
// src/lib/dashboard/getRecentActivity.ts

import { getPayload } from 'payload'
import config from '@payload-config'

import type { RecentActivityItem } from './dashboardTypes'

const ACTIVITY_COLLECTIONS = [
  {
    slug: 'services',
    label: 'Service',
    href: '/admin/collections/services',
  },
  {
    slug: 'developers',
    label: 'Superhero',
    href: '/admin/collections/developers',
  },
  {
    slug: 'posts',
    label: 'Post',
    href: '/admin/collections/posts',
  },
  {
    slug: 'pages',
    label: 'Page',
    href: '/admin/collections/pages',
  },
  {
    slug: 'form-submissions',
    label: 'Form submission',
    href: '/admin/collections/form-submissions',
  },
  {
    slug: 'newsletter-subscribers',
    label: 'Newsletter subscriber',
    href: '/admin/collections/newsletter-subscribers',
  },
] as const

export async function getRecentActivity(
  limit = 8,
): Promise<RecentActivityItem[]> {
  const payload = await getPayload({ config })

  const results = await Promise.all(
    ACTIVITY_COLLECTIONS.map(async (collection) => {
      try {
        const response = await payload.find({
          collection: collection.slug,
          limit,
          page: 1,
          sort: '-updatedAt',
          depth: 0,
          // Dashboard data is read by the authenticated admin dashboard itself.
          overrideAccess: true,
        })

        return response.docs.map((doc) => {
          const createdAt = doc.createdAt
          const updatedAt = doc.updatedAt

          const isNew = createdAt === updatedAt

          const record = doc as unknown as Record<string, unknown>

          const title =
            (typeof record.title === 'string' && record.title) ||
            (typeof record.name === 'string' && record.name) ||
            (typeof record.email === 'string' && record.email) ||
            `${collection.label} #${doc.id}`

          return {
            id: `${collection.slug}-${doc.id}`,
            title: isNew
              ? `New ${collection.label.toLowerCase()} created`
              : `${collection.label} updated`,
            description: title,
            collection: collection.slug,
            action: isNew ? 'created' as const : 'updated' as const,
            timestamp: updatedAt,
            href: `${collection.href}/${doc.id}`,
          }
        })
      } catch (error) {
        console.error(
          `Unable to fetch ${collection.slug} activity:`,
          error,
        )
        return []
      }
    }),
  )

  return results
    .flat()
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime(),
    )
    .slice(0, limit)
}
