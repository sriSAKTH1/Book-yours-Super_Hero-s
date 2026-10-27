import Link from 'next/link'

export default function NotFound() {
  return <main className="content-page status-page status-page-centered"><p className="eyebrow eyebrow-dark">404 / Off the map</p><h1>This page isn’t in our city guide.</h1><p>The address may have changed, or the page may no longer be available.</p><div className="status-actions"><Link className="button button-primary" href="/">Go to Superhero HQ</Link><Link className="button button-quiet" href="/services">Explore hero services</Link></div></main>
}
