
import { getPayload } from 'payload'
import config from '@payload-config'

import type { DashboardStats } from './dashboardTypes'

async function getCollectionCount(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: string,
): Promise<number> {
  const result = await payload.find({
    collection: collection as any,
    limit: 1,
    page: 1,
    depth: 0,
    overrideAccess: true,
  })

  return result.totalDocs
}

async function getPublishedPageCount(payload: Awaited<ReturnType<typeof getPayload>>): Promise<number> {
  const result = await payload.find({
    collection: 'pages',
    where: { status: { equals: 'published' } },
    limit: 1,
    page: 1,
    depth: 0,
    overrideAccess: true,
  })

  return result.totalDocs
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const payload = await getPayload({ config })

  const [
    users,
    media,
    pages,
    forms,
    formSubmissions,
    searchResults,
    services,
    superheroes,
    posts,
    contactInquiries,
    consultationRequests,
    newsletterSubscribers,
  ] = await Promise.all([
    getCollectionCount(payload, 'users'),
    getCollectionCount(payload, 'media'),
    getPublishedPageCount(payload),
    getCollectionCount(payload, 'forms'),
    getCollectionCount(payload, 'form-submissions'),
    getCollectionCount(payload, 'search'),
    getCollectionCount(payload, 'services'),
    getCollectionCount(payload, 'developers'),
    getCollectionCount(payload, 'posts'),
    getCollectionCount(payload, 'contact-inquiries'),
    getCollectionCount(payload, 'consultation-requests'),
    getCollectionCount(payload, 'newsletter-subscribers'),
  ])

  return {
    users,
    media,
    pages,
    forms,
    formSubmissions,
    searchResults,
    services,
    superheroes,
    posts,
    contactInquiries,
    consultationRequests,
    newsletterSubscribers,
  }
}
