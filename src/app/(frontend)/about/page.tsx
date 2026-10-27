import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import PageBuilder from '@/components/PageBuilder'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { pageType: { equals: 'about' } },
        { or: [{ _status: { equals: 'published' } }, { status: { equals: 'published' } }] },
      ],
    },
    limit: 1,
    depth: 2,
  })
  const page = result.docs[0]

  return {
    title: page?.seo?.metaTitle || page?.title || 'About us',
    description: page?.seo?.metaDescription || page?.heroDescription || 'Learn about Superhero HQ and our community-first approach to hero services.',
  }
}

export default async function AboutPage() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { pageType: { equals: 'about' } },
        { or: [{ _status: { equals: 'published' } }, { status: { equals: 'published' } }] },
      ],
    },
    limit: 1,
    depth: 2,
  })
  const page = result.docs[0]

  if (page?.layout?.length) {
    return <main><PageBuilder blocks={page.layout} /></main>
  }

  return (
    <main className="content-page about-page">
      <header className="content-page-heading">
        <p className="eyebrow eyebrow-dark">A safer city, together</p>
        <h1>{page?.heroTitle || page?.title || 'Heroes are here for everyone.'}</h1>
        <p>{page?.heroDescription || 'Superhero HQ connects trusted heroes with people and neighborhoods that need help. We coordinate rescue, protection, and recovery with care, courage, and respect.'}</p>
      </header>
      <section className="about-values">
        <article className="content-card"><p className="eyebrow eyebrow-dark">01 / Rescue</p><h2>Show up when it matters.</h2><p>We help coordinate rapid response so people can get to safety and find the support they need.</p></article>
        <article className="content-card"><p className="eyebrow eyebrow-dark">02 / Protect</p><h2>Put people first.</h2><p>Our heroes work with local communities, listen carefully, and protect the dignity of everyone involved.</p></article>
        <article className="content-card"><p className="eyebrow eyebrow-dark">03 / Rebuild</p><h2>Stay for the recovery.</h2><p>After the immediate danger passes, we connect neighbors with practical help to recover and rebuild.</p></article>
      </section>
    </main>
  )
}
