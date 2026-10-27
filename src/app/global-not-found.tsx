import Link from 'next/link'
import './(frontend)/styles.css'
import './(frontend)/ui.css'
import './(frontend)/superhero.css'
import WebsiteHeader from '@/components/WebsiteHeader'
import WebsiteFooter from '@/components/WebsiteFooter'

export const metadata = {
  title: '404 — City guide not found | Superhero HQ',
  description: 'The page you are looking for is not part of the Superhero HQ city guide.',
}

export default async function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="global-not-found-body">
        <WebsiteHeader />
        <main className="content-page status-page status-page-centered">
          <p className="eyebrow eyebrow-dark">404 / Off the map</p>
          <h1>This page isn’t in our city guide.</h1>
          <p>The address may have changed, or the page may no longer be available.</p>
          <div className="status-actions">
            <Link className="button button-primary" href="/">Go to Superhero HQ</Link>
            <Link className="button button-quiet" href="/services">Explore hero services</Link>
          </div>
        </main>
        <WebsiteFooter />
      </body>
    </html>
  )
}
