import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import { developerMetadata, getPublishedDeveloper } from '@/lib/seo'

export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return developerMetadata(await getPublishedDeveloper(slug), `/superheroes/${encodeURIComponent(slug)}`)
}

export default async function SuperheroProfilePage({ params }: Props) {
  const { slug } = await params
  const hero = await getPublishedDeveloper(slug)
  if (!hero) notFound()
  const photo = hero.photo && typeof hero.photo === 'object' ? hero.photo.url : null

  return (
    <main>
      <section className="profile-hero">
        <div className="profile-inner">
          <div className="profile-photo">
            {photo ? <Image src={photo} alt={hero.name} width={600} height={600} sizes="(max-width: 600px) 150px, 230px" loading="eager" /> : hero.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
          </div>
          <div>
            <Link href="/superheroes" className="profile-back-link">← Meet the superheroes</Link>
            <h1>{hero.name}</h1>
            <p className="job-title">{hero.jobTitle}</p>
            {hero.skills && <p className="profile-skills">{hero.skills}</p>}
          </div>
        </div>
      </section>
      <section className="profile-content">
        <h2>{hero.name.split(' ')[0]}’s story</h2>
        {hero.biography ? <RichText data={hero.biography} className="profile-biography" /> : <p className="profile-coming-soon">Hero story coming soon.</p>}
        {Array.isArray(hero.services) && hero.services.length > 0 && (
          <>
            <h2 className="profile-services-heading">Hero services</h2>
            <div className="content-grid">
              {hero.services.map((service, index) => {
                const item = typeof service === 'object' && service !== null ? service : null
                return <article className="content-card" key={item?.id ?? index}><h3>{item?.title ?? 'Hero service'}</h3></article>
              })}
            </div>
          </>
        )}
      </section>
    </main>
  )
}

