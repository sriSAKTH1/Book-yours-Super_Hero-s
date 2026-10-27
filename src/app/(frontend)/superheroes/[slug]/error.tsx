'use client'

import Link from 'next/link'

export default function SuperheroError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="content-page status-page"><p className="eyebrow eyebrow-dark">A momentary setback</p><h1>We couldn’t load this hero.</h1><p>Please try again in a moment.</p><div className="status-actions"><button className="button button-primary" onClick={() => reset()}>Try again</button><Link className="button button-quiet" href="/">Return home</Link></div></main>
}
