import Link from 'next/link'
import PageBuilder from '@/components/PageBuilder'
import { getPayloadClient } from '@/lib/payload'
import { servicePresentation } from '@/lib/siteContent'
import type { Metadata } from 'next'
import { getPublicPageByType, pageMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPublicPageByType('services'), '/services', 'Hero services', 'Explore rescue, protection, and recovery services from Superhero HQ.')
}

export default async function ServicesPage() {
  const payload = await getPayloadClient()
  const page = await getPublicPageByType('services')
  if (page?.layout?.length) return <main><PageBuilder blocks={page.layout} /></main>

  const result = await payload.find({
    collection: 'services',
    where: { status: { equals: 'published' } },
    limit: 100,
    sort: 'displayOrder',
    depth: 1,
  })
  const groups = result.docs.reduce<Record<string, typeof result.docs>>((all, service) => {
    const category = service.category?.trim() || 'More ways we help'
    all[category] ??= []
    all[category].push(service)
    return all
  }, {})
  const serviceGroups = Object.entries(groups).sort(([a], [b]) => {
    if (a === 'Technology & Innovation') return -1
    if (b === 'Technology & Innovation') return 1
    return a.localeCompare(b)
  })

  return (
    <main className="content-page">
      <header className="content-page-heading">
        <p className="eyebrow eyebrow-dark">How we help</p>
        <h1>{page?.heroTitle || 'Hero services, ready when it matters.'}</h1>
        <p>{page?.heroDescription || 'Rescue, protection, and recovery services built around the needs of our community.'}</p>
      </header>
      {result.docs.length ? (
        <div className="service-groups">
          {serviceGroups.map(([category, services]) => (
            <section className="service-group" key={category}>
              <h2>{category}</h2>
              <div className="content-grid">
                {services.map((service) => {
                  const presentation = servicePresentation(service)
                  return (
                    <Link
                      className="service-card service-list-card"
                      href={`/services/${service.slug}`}
                      key={service.id}
                    >
                      <div className="service-icon" aria-hidden="true">↗</div>
                      <h3>{presentation.title}</h3>
                      <p>{presentation.shortDescription}</p>
                      <span className="card-arrow" aria-hidden="true">↗</span>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>Our response teams are standing by.</h3>
          <p>Published hero services from Payload CMS will appear here.</p>
        </div>
      )}
    </main>
  )
}
