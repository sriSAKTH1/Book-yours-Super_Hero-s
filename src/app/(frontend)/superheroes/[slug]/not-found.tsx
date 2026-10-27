import Link from 'next/link'

export default function SuperheroNotFound() {
  return <main className="content-page status-page"><p className="eyebrow eyebrow-dark">Hero not found</p><h1>This hero isn’t on the roster.</h1><p>They may be off duty or this profile may have moved.</p><Link className="button button-primary" href="/superheroes">Meet all superheroes</Link></main>
}
