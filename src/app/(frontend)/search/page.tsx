import type { Metadata } from 'next'
import SiteSearch from '@/components/SiteSearch'
import { getPayloadClient } from '@/lib/payload'
import type { Search } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search published superhero services, profiles, and insights.',
}

type Props = { searchParams: Promise<{ q?: string }> }

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const initialQuery = q?.trim() ?? ''
  let initialResults: Search[] = []
  let initialError = ''

  if (initialQuery) {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'search',
        where: {
          or: [
            { title: { like: initialQuery } },
            { excerpt: { like: initialQuery } },
          ],
        },
        limit: 20,
        sort: '-priority',
        depth: 0,
      })
      initialResults = result.docs
    } catch (error) {
      console.error('Search query failed:', error)
      initialError = 'Search is temporarily unavailable. Please try again.'
    }
  }

  return (
    <main className="site-search-page">
      <section className="site-search-heading">
        <p className="eyebrow eyebrow-dark">Find your way</p>
        <h1>Search Superhero Services</h1>
        <p>Explore published services, superhero profiles, and stories from the network.</p>
      </section>
      <SiteSearch initialQuery={initialQuery} initialResults={initialResults} initialError={initialError} />
    </main>
  )
}
