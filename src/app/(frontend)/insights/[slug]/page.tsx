import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import { getPublishedPost, postMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return postMetadata(await getPublishedPost(slug), `/insights/${encodeURIComponent(slug)}`)
}

export default async function InsightArticlePage({ params }: Props) {
  const { slug } = await params
  const post = await getPublishedPost(slug)

  if (!post) {
    notFound()
  }

  const image =
    post.featuredImage && typeof post.featuredImage === 'object' && 'url' in post.featuredImage
      ? post.featuredImage.url
      : null

  return (
    <main className="insight-article-page">
      <article className="insight-article">
        <Link href="/insights" className="insight-back-link">
          <span aria-hidden="true">←</span> All insights
        </Link>

        <header className="insight-article-header">
          {post.category && (
            <p className="eyebrow eyebrow-dark">{post.category.replaceAll('-', ' ')}</p>
          )}
          {post.publishedAt && (
            <p className="insight-date">
              {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}

          <h1>{post.title}</h1>

          {post.excerpt && <p className="insight-article-excerpt">{post.excerpt}</p>}
        </header>

        {image && (
          <Image
            src={image}
            alt={post.title}
            width={1600}
            height={900}
            sizes="(max-width: 920px) calc(100vw - 42px), 856px"
            loading="eager"
            className="insight-article-image"
          />
        )}

        <RichText data={post.content} className="insight-article-content" />

        <div className="insight-article-cta">
          <Link href="/contact" className="button button-dark">
            Talk to our team <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </article>
    </main>
  )
}
