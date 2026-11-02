'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

import { getContentPerformance } from '@/lib/dashboard/getContentPerformance'
import type { DashboardDateRange } from '@/lib/dashboard/dashboardTypes'

export async function fetchContentPerformance(range: DashboardDateRange) {
  // Validate the requested date range.
  if (!['7days', '30days', '90days'].includes(range)) {
    throw new Error('Invalid dashboard date range')
  }

  // Verify that the requester is authenticated.
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    throw new Error('Unauthorized dashboard request')
  }

  return getContentPerformance(range)
}
