import Link from 'next/link'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'
import PageBuilder from '@/components/PageBuilder'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Meet the superheroes',
  description: 'Meet the heroes protecting our city and helping our community.',
}

export default async function SuperheroesPage() {
  const payload = await getPayloadClient()
  const pageResult = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { pageType: { equals: 'superheroes' } },
        { or: [{ _status: { equals: 'published' } }, { status: { equals: 'published' } }] },
      ],
    },
    limit: 1,
    depth: 1,
  })
  const page = pageResult.docs[0]
  if (page?.layout?.length) return <main><PageBuilder blocks={page.layout} /></main>

  const { docs: heroes } = await payload.find({
    collection: 'developers',
    where: { status: { equals: 'published' } },
    limit: 100,
    sort: 'displayOrder',
    depth: 1,
  })

  return (
    <main className="content-page">
      <header className="content-page-heading">
        <p className="eyebrow eyebrow-dark">The people who answer the call</p>
        <h1>{page?.heroTitle || 'Meet our superheroes.'}</h1>
        <p>{page?.heroDescription || 'Rescuers, protectors, and neighbors working together to make every day safer.'}</p>
      </header>
      {heroes.length ? (
        <>
          <p className="developer-count">{heroes.length} {heroes.length === 1 ? 'hero' : 'heroes'} in the network</p>
          <div className="content-grid developer-grid">
            {heroes.map((hero) => {
              const photo = hero.photo && typeof hero.photo === 'object' ? hero.photo.url : null
              const initials = hero.name.split(' ').map((part) => part[0]).slice(0, 2).join('')
              return (
                <Link className="developer-card" href={`/superheroes/${hero.slug}`} key={hero.id}>
                  <div className="developer-photo">
                    {photo ? <Image src={photo} alt={hero.name} width={800} height={600} sizes="(max-width: 600px) calc(100vw - 42px), (max-width: 800px) calc(50vw - 50px), 340px" /> : <span>{initials}</span>}
                  </div>
                  <div className="developer-card-copy">
                    <p className="eyebrow eyebrow-dark">Superhero</p>
                    <h2>{hero.name}</h2>
                    <p className="developer-role">{hero.jobTitle}</p>
                    {hero.skills && <p className="developer-skills">{hero.skills}</p>}
                    <span className="developer-profile-link">View hero profile <span aria-hidden="true">↗</span></span>
                  </div>
                </Link>
              )
            })}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <h2>Our heroes are getting ready.</h2>
          <p>Publish superhero profiles in Payload CMS and they’ll appear here.</p>
        </div>
      )}
    </main>
  )
}
