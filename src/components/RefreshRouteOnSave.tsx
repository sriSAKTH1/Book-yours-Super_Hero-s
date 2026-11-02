'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export default function LivePreviewRefresh() {
  const router = useRouter()
  const refresh = useCallback(() => router.refresh(), [router])

  return (
    <RefreshRouteOnSave
      refresh={refresh}
      serverURL={process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}
    />
  )
}
