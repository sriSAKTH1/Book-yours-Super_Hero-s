import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.ts'

function richText(...paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        version: 1,
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        textStyle: '',
        children: [{ type: 'text', version: 1, text }],
      })),
    },
  }
}

const services = [
  {
    title: 'Search & Rescue',
    slug: 'search-and-rescue',
    category: 'Rescue & Response',
    shortDescription: 'Coordinate trained search teams to locate people and guide them to safety.',
    description: richText(
      'When someone is missing or cut off from help, coordinated search teams can make a critical difference. We help organize trained responders, share verified information, and keep families informed.',
      'Every response is planned around local conditions and the safety of both the people being helped and the responders on the ground.',
    ),
    featured: true,
    displayOrder: 8,
  },
  {
    title: 'Emergency Shelter Coordination',
    slug: 'emergency-shelter-coordination',
    category: 'Recovery & Support',
    shortDescription: 'Connect displaced neighbors with safe shelter, supplies, and practical support.',
    description: richText(
      'Our shelter coordinators work with local partners to identify safe places to stay and connect people with essential supplies and reliable updates.',
      'We help keep support organized so families can focus on their next steps with dignity and care.',
    ),
    featured: false,
    displayOrder: 9,
  },
  {
    title: 'Community Preparedness',
    slug: 'community-preparedness',
    category: 'Prevention & Readiness',
    shortDescription: 'Help neighborhoods prepare response plans before an emergency happens.',
    description: richText(
      'Prepared communities can act sooner and support one another more effectively. We help neighbors identify local needs, plan communication, and understand where to find trusted help.',
      'Workshops and planning sessions are shaped with the people who know their community best.',
    ),
    featured: false,
    displayOrder: 10,
  },
]

const heroes = [
  {
    name: 'Lifeline',
    slug: 'lifeline',
    jobTitle: 'Emergency Medical Coordinator',
    skills: 'First aid, triage coordination, calm communication',
    biography: richText(
      'Lifeline brings medical responders and community support teams together when every minute matters. Their steady presence helps people feel seen and supported while care is coordinated.',
      'They believe clear information and a compassionate first response can help a whole neighborhood find its footing.',
    ),
    serviceSlug: 'medical-response',
    displayOrder: 8,
  },
  {
    name: 'Quakeguard',
    slug: 'quakeguard',
    jobTitle: 'Search & Rescue Specialist',
    skills: 'Search planning, hazard awareness, rescue coordination',
    biography: richText(
      'Quakeguard specializes in organizing safe, careful searches after an emergency. They work closely with local responders, share verified updates, and keep the needs of families at the center of every operation.',
      'Their strength is preparation: understanding the terrain, checking the facts, and helping each team know its role.',
    ),
    serviceSlug: 'search-and-rescue',
    displayOrder: 9,
  },
  {
    name: 'Skyscout',
    slug: 'skyscout',
    jobTitle: 'Aerial Response Scout',
    skills: 'Situation awareness, route planning, emergency communications',
    biography: richText(
      'Skyscout helps response teams understand changing conditions and identify safer routes. They turn observations into clear information that ground teams and neighbors can use.',
      'Whether supporting an evacuation or a preparedness plan, Skyscout looks for ways to help people move with confidence.',
    ),
    serviceSlug: 'safe-passage',
    displayOrder: 10,
  },
]

const payload = await getPayload({ config })

try {
  const serviceIds = new Map<string, string>()

  for (const service of services) {
    const existing = await payload.find({
      collection: 'services',
      where: { slug: { equals: service.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    let id = existing.docs[0]?.id

    if (!id) {
      const created = await payload.create({
        collection: 'services',
        data: { ...service, status: 'published', _status: 'published' } as never,
        overrideAccess: true,
      })
      id = created.id
      console.log(`Added service: ${service.title}`)
    } else {
      console.log(`Kept existing service: ${service.title}`)
    }

    serviceIds.set(service.slug, String(id))
  }

  for (const hero of heroes) {
    const existing = await payload.find({
      collection: 'developers',
      where: { slug: { equals: hero.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (existing.docs.length) {
      console.log(`Kept existing superhero: ${hero.name}`)
      continue
    }

    const serviceId = serviceIds.get(hero.serviceSlug)
    await payload.create({
      collection: 'developers',
      data: {
        name: hero.name,
        slug: hero.slug,
        jobTitle: hero.jobTitle,
        skills: hero.skills,
        biography: hero.biography,
        services: serviceId ? [serviceId] : [],
        featured: true,
        displayOrder: hero.displayOrder,
        status: 'published',
        _status: 'published',
      } as never,
      overrideAccess: true,
    })
    console.log(`Added superhero: ${hero.name}`)
  }
} finally {
  await payload.destroy()
}
