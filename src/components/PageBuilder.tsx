import Image from 'next/image'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Page, Service } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'
import { servicePresentation } from '@/lib/siteContent'

type PageBlock = NonNullable<Page['layout']>[number]
type UploadedImage = { url?: string | null; alt?: string | null } | string | null | undefined

function imageUrl(image: UploadedImage): string | null {
  return typeof image === 'object' && image ? image.url ?? null : null
}

function imageAlt(image: UploadedImage, fallback: string): string {
  return typeof image === 'object' && image?.alt ? image.alt : fallback
}

function isService(service: string | Service): service is Service {
  return typeof service === 'object' && service !== null && 'slug' in service
}

export default function PageBuilder({ blocks }: { blocks: Page['layout'] }) {
  if (!blocks?.length) return null

  return (
    <div className="page-builder">
      {blocks.map((block, index) => (
        <PageBlockView key={block.id ?? `${block.blockType}-${index}`} block={block} />
      ))}
    </div>
  )
}

async function PageBlockView({ block }: { block: PageBlock }) {
  if (block.blockType === 'hero') {
    const src = imageUrl(block.image)
    return (
      <section className={`builder-hero${src ? '' : ' builder-hero-no-image'}`}>
        <div className="builder-hero-copy">
          {block.eyebrow && <p className="eyebrow eyebrow-dark">{block.eyebrow}</p>}
          <h1>{block.heading}</h1>
          {block.description && <p>{block.description}</p>}
          {block.buttonLabel && block.buttonUrl && (
            <Link className="button button-primary" href={block.buttonUrl}>
              {block.buttonLabel} <span aria-hidden="true">↗</span>
            </Link>
          )}
        </div>
        {src && (
          <div className="builder-hero-image">
            <Image src={src} alt={imageAlt(block.image, block.heading)} fill priority sizes="(max-width: 800px) 100vw, 48vw" />
          </div>
        )}
      </section>
    )
  }

  if (block.blockType === 'imageText') {
    const src = imageUrl(block.image)
    return (
      <section className={`builder-split image-side-${block.imageSide ?? 'right'}${src ? '' : ' builder-split-no-image'}`}>
        {src && <div className="builder-split-image"><Image src={src} alt={imageAlt(block.image, block.heading)} fill sizes="(max-width: 800px) 100vw, 45vw" /></div>}
        <div className="builder-split-copy">
          {block.eyebrow && <p className="eyebrow eyebrow-dark">{block.eyebrow}</p>}
          <h2>{block.heading}</h2>
          <RichText data={block.body} />
          {block.buttonLabel && block.buttonUrl && <Link className="button button-primary" href={block.buttonUrl}>{block.buttonLabel} <span aria-hidden="true">↗</span></Link>}
        </div>
      </section>
    )
  }

  if (block.blockType === 'about') {
    const src = imageUrl(block.image)
    return (
      <section className="builder-about section">
        {src && <div className="builder-about-image"><Image src={src} alt={imageAlt(block.image, block.heading)} fill sizes="(max-width: 800px) 100vw, 42vw" /></div>}
        <div className="builder-about-copy">
          {block.eyebrow && <p className="eyebrow eyebrow-dark">{block.eyebrow}</p>}
          <h2>{block.heading}</h2>
          <RichText data={block.body} />
          {!!block.values?.length && <div className="builder-values">{block.values.map((value, index) => (
            <article className="content-card" key={value.id ?? `${value.title}-${index}`}>
              <h3>{value.title}</h3><p>{value.description}</p>
            </article>
          ))}</div>}
        </div>
      </section>
    )
  }

  if (block.blockType === 'faqSection') {
    return (
      <section className="section faq-section">
        <div className="faq-heading"><h2>{block.heading || 'Questions, answered.'}</h2>{block.intro && <p>{block.intro}</p>}</div>
        <div className="faq-list">{block.items?.map((faq, index) => (
          <details className="faq-item" key={faq.id ?? `${faq.question}-${index}`}>
            <summary>{faq.question}<span className="faq-toggle" aria-hidden="true">+</span></summary>
            <div className="faq-answer"><RichText data={faq.answer} /></div>
          </details>
        ))}</div>
      </section>
    )
  }

  if (block.blockType === 'servicesGrid') {
    let services = (block.services ?? []).filter(isService)

    if (!block.services?.length) {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'services', where: { status: { equals: 'published' } },
        limit: block.limit || 6, sort: 'displayOrder', depth: 1,
      })
      services = result.docs
    }

    services = services.filter((service) => service.status === 'published')
    const groups = services.reduce<Record<string, Service[]>>((all, service) => {
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
      <section className="section builder-grid-section" id={block.anchorId || undefined}>
        <div className="section-heading"><div><h2>{block.heading || 'Our services'}</h2>{block.intro && <p>{block.intro}</p>}</div><Link className="text-link" href="/services">All services ↗</Link></div>
        <div className="service-groups">{serviceGroups.map(([category, groupedServices]) => (
          <section className="service-group" key={category}>
            {category !== 'More ways we help' && <h3>{category}</h3>}
            <div className="service-grid">{groupedServices.map((service, index) => {
              const presentation = servicePresentation(service)
              return <Link className="service-card" href={`/services/${service.slug}`} key={service.id}><span className="card-number">0{index + 1}</span><div className="service-icon" aria-hidden="true">↗</div><h3>{presentation.title}</h3><p>{presentation.shortDescription}</p><span className="card-arrow" aria-hidden="true">↗</span></Link>
            })}</div>
          </section>
        ))}</div>
      </section>
    )
  }

  if (block.blockType === 'superheroesGrid') {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'developers', where: { status: { equals: 'published' } },
      limit: block.limit || 3, sort: 'displayOrder', depth: 1,
    })
    return (
      <section className="section builder-grid-section" id={block.anchorId || undefined}>
        <div className="section-heading"><div><h2>{block.heading || 'Meet the superheroes'}</h2>{block.intro && <p>{block.intro}</p>}</div><Link className="text-link" href="/superheroes">Meet the team ↗</Link></div>
        {docs.length ? (
          <div className="builder-heroes-grid">{docs.map((hero) => {
            const src = imageUrl(hero.photo)
            return <Link className="builder-hero-card" href={`/superheroes/${hero.slug}`} key={hero.id}>{src ? <div className="builder-hero-card-image"><Image src={src} alt={imageAlt(hero.photo, hero.name)} fill sizes="(max-width: 600px) 90vw, 30vw" /></div> : <div className="builder-hero-card-placeholder">✳</div>}<h3>{hero.name}</h3><p>{hero.jobTitle}</p></Link>
          })}</div>
        ) : (
          <div className="empty-state"><h3>New heroes are on the way.</h3><p>Published superhero profiles will appear here.</p></div>
        )}
      </section>
    )
  }

  if (block.blockType === 'postsGrid') {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'posts', where: { status: { equals: 'published' } },
      limit: block.limit || 6, sort: '-publishedAt', depth: 1,
    })
    return (
      <section className="section builder-grid-section" id={block.anchorId || undefined}>
        <div className="section-heading"><div><h2>{block.heading || 'Latest insights'}</h2>{block.intro && <p>{block.intro}</p>}</div></div>
        {docs.length ? <div className="insights-grid">{docs.map((post) => {
          const src = imageUrl(post.featuredImage)
          return <article className="insight-card" key={post.id}>
            {src && <Image src={src} alt={imageAlt(post.featuredImage, post.title)} width={1200} height={675} sizes="(max-width: 600px) calc(100vw - 42px), (max-width: 760px) calc(50vw - 50px), 360px" className="insight-image" />}
            <div className="insight-card-content">
              {post.category && <p className="eyebrow eyebrow-dark">{post.category.replaceAll('-', ' ')}</p>}
              <h3>{post.title}</h3>
              {post.excerpt && <p className="insight-excerpt">{post.excerpt}</p>}
              <Link href={`/insights/${post.slug}`} className="insight-read-link">Read more <span aria-hidden="true">↗</span></Link>
            </div>
          </article>
        })}</div> : <div className="empty-state"><h3>Fresh thinking is on the way.</h3><p>Published posts will appear here.</p></div>}
      </section>
    )
  }

  if (block.blockType === 'callToAction') {
    return <section className="builder-cta"><div>{block.eyebrow && <p className="eyebrow eyebrow-dark">{block.eyebrow}</p>}<h2>{block.heading}</h2>{block.description && <p>{block.description}</p>}</div><Link className="button button-dark" href={block.buttonUrl || '/contact'}>{block.buttonLabel || 'Get in touch'} <span aria-hidden="true">↗</span></Link></section>
  }

  return null
}
