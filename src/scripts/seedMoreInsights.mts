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

const posts = [
  {
    title: 'A neighborhood ready before the storm',
    slug: 'neighborhood-ready-before-the-storm',
    excerpt: 'Simple ways neighbors can prepare, share reliable information, and look out for one another before severe weather arrives.',
    category: 'legal-insights',
    publishedAt: '2026-11-02T09:00:00.000Z',
    featured: true,
    content: richText(
      'Preparedness starts with knowing who is nearby and how to reach them. A shared contact list, a meeting point, and a plan for checking on neighbors can make the first hours of a severe weather event less confusing.',
      'Keep essential supplies together, charge phones and backup batteries, and follow updates from trusted local authorities. If someone nearby needs extra support, ask in advance what would help and include that in the plan.',
      'The strongest response is a community effort. Small, practical steps taken together help everyone act with more confidence when conditions change.',
    ),
  },
  {
    title: 'How coordinated search and rescue works',
    slug: 'how-coordinated-search-and-rescue-works',
    excerpt: 'A clear overview of how trained teams share information, organize search areas, and keep safety at the center of a response.',
    category: 'case-updates',
    publishedAt: '2026-10-28T09:00:00.000Z',
    featured: false,
    content: richText(
      'A search response begins by gathering reliable details and coordinating with the appropriate local authorities. Trained teams divide the area into manageable sections, establish check-in points, and keep a shared record of where teams have searched.',
      'Good coordination protects both the person being sought and the responders. Teams use clear roles, regular communication, and a plan for changing conditions rather than entering unsafe areas on their own.',
      'Community members can help by sharing verified information with coordinators and keeping roads and access points clear for response teams.',
    ),
  },
  {
    title: 'Meet the people behind a community response',
    slug: 'people-behind-a-community-response',
    excerpt: 'Medical coordinators, safety teams, and local partners each play a part in helping a neighborhood recover.',
    category: 'firm-news',
    publishedAt: '2026-10-21T09:00:00.000Z',
    featured: false,
    content: richText(
      'A community response is built by many people working together. Medical coordinators help connect people with care, safety teams share practical guidance, and local partners understand the needs and resources of their neighborhood.',
      'The work continues after the immediate emergency. Recovery teams help people find supplies, reliable information, and connections to ongoing support.',
      'At Superhero HQ, we are grateful for every person who contributes time, knowledge, and care to help neighbors move forward.',
    ),
  },
]

const payload = await getPayload({ config })

try {
  for (const post of posts) {
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: post.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    if (existing.docs.length) {
      console.log(`Kept existing insight: ${post.title}`)
      continue
    }

    await payload.create({
      collection: 'posts',
      data: { ...post, status: 'published', _status: 'published' } as never,
      overrideAccess: true,
    })
    console.log(`Added insight: ${post.title}`)
  }
} finally {
  await payload.destroy()
}
