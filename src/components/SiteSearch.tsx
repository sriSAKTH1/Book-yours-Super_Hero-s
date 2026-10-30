'use client'

import { useCallback, useState, type FormEvent } from 'react'
import Link from 'next/link'
import type { Search } from '@/payload-types'

type SearchResult = Pick<Search, 'id' | 'title' | 'excerpt' | 'url'>

export default function SiteSearch({
  initialQuery = '',
  initialResults = [],
  initialError = '',
}: {
  initialQuery?: string
  initialResults?: SearchResult[]
  initialError?: string
}) {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>(initialResults)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(Boolean(initialQuery))
  const [error, setError] = useState(initialError)

  const search = useCallback(async (value: string) => {
    const normalizedQuery = value.trim()
    setSubmitted(true)
    setError('')

    if (!normalizedQuery) {
      setResults([])
      setError('Enter a word or phrase to search.')
      return
    }

    setLoading(true)
    setResults([])
    const params = new URLSearchParams({
      'where[or][0][title][like]': normalizedQuery,
      'where[or][1][excerpt][like]': normalizedQuery,
      limit: '20',
      sort: '-priority',
      depth: '0',
    })

    try {
      const response = await fetch(`/api/search?${params.toString()}`, { cache: 'no-store' })
      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(typeof payload?.errors?.[0]?.message === 'string'
          ? payload.errors[0].message
          : 'Search is temporarily unavailable. Please try again.')
      }

      setResults(Array.isArray(payload?.docs) ? payload.docs as SearchResult[] : [])
      const url = new URL(window.location.href)
      url.searchParams.set('q', normalizedQuery)
      window.history.replaceState(null, '', url)
    } catch (searchError) {
      setResults([])
      setError(searchError instanceof Error ? searchError.message : 'Search is temporarily unavailable. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void search(query)
  }

  return (
    <div className="site-search">
      <form className="site-search-form" onSubmit={handleSubmit} role="search">
        <label htmlFor="site-search-query">Search Superhero Services</label>
        <div className="site-search-controls">
          <input
            id="site-search-query"
            name="q"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search services, superheroes, and insights"
            autoComplete="off"
            required
          />
          <button className="button button-dark" type="submit" disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </div>
      </form>

      {loading && <p className="site-search-status" role="status" aria-live="polite">Searching published content…</p>}
      {!loading && error && <p className="form-error" role="alert">{error}</p>}
      {!loading && !error && submitted && results.length === 0 && (
        <p className="site-search-status" role="status">No results found. Try another word or phrase.</p>
      )}

      {results.length > 0 && (
        <section className="site-search-results" aria-label="Search results" aria-live="polite">
          <p className="site-search-count">{results.length} {results.length === 1 ? 'result' : 'results'}</p>
          {results.map((result) => (
            <article className="site-search-result" key={result.id}>
              <h2><Link href={result.url || '/'}>{result.title}</Link></h2>
              {result.excerpt && <p>{result.excerpt}</p>}
              <Link className="site-search-result-link" href={result.url || '/'}>View page <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </section>
      )}
    </div>
  )
}
