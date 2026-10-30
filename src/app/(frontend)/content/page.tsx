import Image from 'next/image'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import type { Metadata } from 'next'
import { createDocumentMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = createDocumentMetadata({
  fallbackTitle: 'Superhero HQ content',
  fallbackDescription: 'Browse updates, rescue reports, and practical stories from our hero network.',
  pathname: '/content',
})

export default async function ContentPage() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 100,
    depth: 1,
  })

  return (
    <main className="insights-page">
      <section className="insights-hero">
        <div className="insights-hero-inner">
          <p className="eyebrow">The Superhero HQ library</p>
          <h1>Content for every part of the mission.</h1>
          <p>Browse updates, rescue reports, and practical stories from our hero network.</p>
        </div>
      </section>

      <section className="insights-content" aria-label="Published content">
        {docs.length === 0 ? (
          <div className="empty-state insights-empty">
            <h2>New content is on the way.</h2>
            <p>Published stories and updates will appear here soon.</p>
          </div>
        ) : (
          <div className="insights-grid">
            {docs.map((post) => {
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
                    {post.category && <p className="eyebrow eyebrow-dark">{post.category.replaceAll('-', ' ')}</p>}
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
                      Read more <span aria-hidden="true">↗</span>
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
