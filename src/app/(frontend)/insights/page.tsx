import Link from 'next/link'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'
import PageBuilder from '@/components/PageBuilder'
import type { Metadata } from 'next'
import { getPublicPageByType, pageMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPublicPageByType('insights'), '/insights', 'Superhero HQ insights', 'Updates, rescue reports, and community stories from our hero network.')
}

export default async function InsightsPage() {
  const payload = await getPayloadClient()
  const page = await getPublicPageByType('insights')
  if (page?.layout?.length) return <main><PageBuilder blocks={page.layout} /></main>

  const result = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 50,
    depth: 1,
  })

  return (
    <main className="insights-page">
      <section className="insights-hero">
        <div className="insights-hero-inner">
          <p className="eyebrow">Dispatches from the network</p>
          <h1>{page?.heroTitle || 'Stories from the city.'}</h1>
          <p>{page?.heroDescription || 'Hero updates, rescue reports, and community stories from across our network.'}</p>
        </div>
      </section>

      <section className="insights-content">
        {result.docs.length === 0 ? (
          <div className="empty-state insights-empty">
            <h2>Fresh thinking is on the way.</h2>
            <p>No published articles are available yet. Please check back soon.</p>
          </div>
        ) : (
          <div className="insights-grid">
            {result.docs.map((post) => {
              const image =
                post.featuredImage &&
                typeof post.featuredImage === 'object' &&
                'url' in post.featuredImage
                  ? post.featuredImage.url
                  : null

              return (
                <article key={post.id} className="insight-card">
                  {image && (
                    <Image
                      src={image}
                      alt={post.title}
                      width={1200}
                      height={675}
                      sizes="(max-width: 600px) calc(100vw - 42px), (max-width: 760px) calc(50vw - 50px), 360px"
                      className="insight-image"
                    />
                  )}

                  <div className="insight-card-content">
                    {post.category && (
                      <p className="eyebrow eyebrow-dark">{post.category.replaceAll('-', ' ')}</p>
                    )}
                    {post.publishedAt && (
                      <p className="insight-date">
                        {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    )}

                    <h2>{post.title}</h2>

                    {post.excerpt && <p className="insight-excerpt">{post.excerpt}</p>}

                    <Link href={`/insights/${post.slug}`} className="insight-read-link">
                      Read article <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
