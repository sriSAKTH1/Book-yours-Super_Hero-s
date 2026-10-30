import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { servicePresentation } from '@/lib/siteContent'
import type { Metadata } from 'next'
import { getPublishedService, serviceMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getPublishedService(slug)
  return serviceMetadata(service, `/services/${encodeURIComponent(slug)}`)
}

export default async function ServiceDetailsPage({ params }: Props) {
  const { slug } = await params
  const service = await getPublishedService(slug)

  if (!service) {
    notFound()
  }

  const image =
    service.image && typeof service.image === 'object' && 'url' in service.image
      ? service.image.url
      : null
  const presentation = servicePresentation(service)

  return (
    <main className="service-detail-page">
      <section className="service-detail-hero">
        <div className="service-detail-hero-inner">
          <Link href="/services" className="service-detail-back">
            <span aria-hidden="true">←</span> All services
          </Link>
          <p className="eyebrow">Hero services</p>
          <h1>{presentation.title}</h1>
          <p className="service-detail-summary">{presentation.shortDescription}</p>
        </div>
      </section>

      <section className="service-detail-content-wrap">
        {image && (
          <Image
            src={image}
            alt={service.title}
            width={1600}
            height={900}
            sizes="(max-width: 1000px) calc(100vw - 42px), 936px"
            loading="eager"
            className="service-detail-image"
          />
        )}
        {service.description && (
          <RichText data={service.description} className="service-detail-rich-text" />
        )}
        <aside className="service-detail-cta">
          <div>
            <p className="eyebrow eyebrow-dark">Let’s get started</p>
            <h2>Ready to make progress?</h2>
            <p>
              Tell us how our hero network can support your community.
            </p>
          </div>
          <Link href="/contact" className="button button-dark">
            Contact us <span aria-hidden="true">↗</span>
          </Link>
        </aside>
      </section>
    </main>
  )
}
