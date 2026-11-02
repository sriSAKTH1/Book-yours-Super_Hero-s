
// src/lib/dashboard/getContentPerformance.ts

import { getPayload } from 'payload'
import config from '@payload-config'

import type {
  ContentPerformanceSummary,
  ContentChartItem,
  DashboardDateRange,
} from './dashboardTypes'

const CONTENT_COLLECTIONS = [
  'pages',
  'services',
  'developers',
  'posts',
] as const

const RANGE_DAYS: Record<DashboardDateRange, number> = {
  '7days': 7,
  '30days': 30,
  '90days': 90,
}

function getDateKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export async function getContentPerformance(
  range: DashboardDateRange = '7days',
): Promise<{
  summary: ContentPerformanceSummary
  chartData: ContentChartItem[]
}> {
  const payload = await getPayload({ config })

  let published = 0
  let drafts = 0

  const days = RANGE_DAYS[range]

  // Use UTC consistently for chart date buckets.
  const startDate = new Date()
  startDate.setUTCHours(0, 0, 0, 0)
  startDate.setUTCDate(startDate.getUTCDate() - days + 1)

  const chartMap = new Map<string, ContentChartItem>()

  // Prepare chart dates.
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setUTCDate(startDate.getUTCDate() + i)

    const key = getDateKey(date)

    chartMap.set(key, {
      date: key,
      published: 0,
      drafts: 0,
    })
  }

  for (const collection of CONTENT_COLLECTIONS) {
    try {
      // Count published and draft documents using the custom status field.
      const [publishedResult, draftResult] = await Promise.all([
        payload.find({
          collection,
          where: {
            status: { equals: 'published' },
          },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        }),

        payload.find({
          collection,
          where: {
            status: { equals: 'draft' },
          },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        }),
      ])

      published += publishedResult.totalDocs
      drafts += draftResult.totalDocs

      // Fetch recently created published documents.
      const recentPublished = await payload.find({
        collection,
        where: {
          and: [
            { status: { equals: 'published' } },
            { createdAt: { greater_than_equal: startDate.toISOString() } },
          ],
        },
        limit: 1000,
        depth: 0,
        sort: 'createdAt',
        overrideAccess: true,
      })

      // Fetch recently created draft documents.
      const recentDrafts = await payload.find({
        collection,
        where: {
          and: [
            { status: { equals: 'draft' } },
            { createdAt: { greater_than_equal: startDate.toISOString() } },
          ],
        },
        limit: 1000,
        depth: 0,
        sort: 'createdAt',
        overrideAccess: true,
      })

      for (const doc of recentPublished.docs) {
        const key = getDateKey(new Date(doc.createdAt))
        const item = chartMap.get(key)

        if (item) item.published++
      }

      for (const doc of recentDrafts.docs) {
        const key = getDateKey(new Date(doc.createdAt))
        const item = chartMap.get(key)

        if (item) item.drafts++
      }
    } catch (error) {
      console.error(
        `Content performance error for ${collection}:`,
        error,
      )
    }
  }

  const total = published + drafts

  const summary: ContentPerformanceSummary = {
    published,
    drafts,
    archived: 0,
    total,
    publishedPercentage:
      total > 0 ? Math.round((published / total) * 100) : 0,
  }

  return {
    summary,
    chartData: Array.from(chartMap.values()),
  }
}
