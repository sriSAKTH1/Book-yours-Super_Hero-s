import PageBuilder from '@/components/PageBuilder'

import Link from 'next/link'
import { getPublicPageByType, pageMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageByType('home')
  return pageMetadata(page, '/', 'Superhero HQ — Help when the city needs it', 'Meet the heroes protecting our city and explore rescue, protection, and recovery services.')
}

export default async function HomePage() {
  const page = await getPublicPageByType('home')

  if (page?.layout?.length) {
    return <main><PageBuilder blocks={page.layout} /></main>
  }

  return (
    <main>
      <section className="content-page home-fallback">
        <header className="content-page-heading">
          <p className="eyebrow eyebrow-dark">Help when the city needs it</p>
          <h1>{page?.heroTitle || page?.title || 'Heroes are here for everyone.'}</h1>
          <p>{page?.heroDescription || 'Superhero HQ connects trusted heroes with people and neighborhoods that need help. Find the right support, meet the team, and follow the latest stories from our community.'}</p>
          <div className="status-actions">
            <Link className="button button-primary" href="/services">Explore services</Link>
            <Link className="button button-quiet" href="/content">Latest stories</Link>
          </div>
        </header>
        <section className="about-values" aria-label="How we help">
          <article className="content-card"><p className="eyebrow eyebrow-dark">01 / Rescue</p><h2>Show up when it matters.</h2><p>Get connected with response teams ready to help people and neighborhoods.</p></article>
          <article className="content-card"><p className="eyebrow eyebrow-dark">02 / Protect</p><h2>Put people first.</h2><p>Our heroes work alongside the community with care, courage, and respect.</p></article>
          <article className="content-card"><p className="eyebrow eyebrow-dark">03 / Rebuild</p><h2>Stay for the recovery.</h2><p>Find practical support to help neighbors recover and move forward together.</p></article>
        </section>
       
      </section>
    </main>
  )
}
