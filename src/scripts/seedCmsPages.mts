import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.ts'

const pageContent = [
  {
    title: 'Home',
    slug: 'home',
    pageType: 'home',
    heroTitle: 'Heroes are here for everyone.',
    heroDescription: 'Superhero HQ connects trusted heroes with people and neighborhoods that need help. Find the right support, meet the team, and follow the latest stories from our community.',
    layout: [
      {
        blockType: 'hero',
        eyebrow: 'Help when the city needs it',
        heading: 'Heroes are here for everyone.',
        description: 'Superhero HQ connects trusted heroes with people and neighborhoods that need help. Find the right support, meet the team, and follow the latest stories from our community.',
        buttonLabel: 'Explore services',
        buttonUrl: '/services',
      },
      {
        blockType: 'about',
        eyebrow: 'A safer city, together',
        heading: 'Rescue. Protect. Rebuild.',
        body: { root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children: [{ type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0, textFormat: 0, textStyle: '', children: [{ type: 'text', version: 1, text: 'We bring people and trusted response teams together with care, courage, and respect. From the first call for help through the work of recovery, our focus stays on the needs of the community.' }] }] } },
        values: [
          { title: 'Show up when it matters.', description: 'Coordinate practical response so people can get to safety and find the support they need.' },
          { title: 'Put people first.', description: 'Listen to local communities and protect the dignity of everyone involved.' },
          { title: 'Stay for the recovery.', description: 'Connect neighbors with support to recover and move forward together.' },
        ],
      },
      { blockType: 'servicesGrid', heading: 'How we help', intro: 'Explore support for urgent response, community protection, and recovery.', limit: 6 },
      { blockType: 'superheroesGrid', heading: 'Meet the superheroes', intro: 'Get to know the people who answer the call.', limit: 3 },
      { blockType: 'postsGrid', heading: 'Latest insights', intro: 'Updates and stories from across our hero network.', limit: 3 },
      { blockType: 'callToAction', eyebrow: 'We are ready to listen', heading: 'Tell us where help is needed.', description: 'Reach out about a service request, partnership, or community question.', buttonLabel: 'Contact the team', buttonUrl: '/contact' },
    ],
  },
  {
    title: 'About',
    slug: 'about',
    pageType: 'about',
    heroTitle: 'A safer city, together.',
    heroDescription: 'Superhero HQ connects trusted heroes with people and neighborhoods that need help. We coordinate rescue, protection, and recovery with care, courage, and respect.',
    layout: [
      { blockType: 'hero', eyebrow: 'Our purpose', heading: 'A safer city, together.', description: 'Superhero HQ connects trusted heroes with people and neighborhoods that need help. We coordinate rescue, protection, and recovery with care, courage, and respect.' },
      {
        blockType: 'about',
        eyebrow: 'Our mission',
        heading: 'Help that starts with people.',
        body: { root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children: [{ type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0, textFormat: 0, textStyle: '', children: [{ type: 'text', version: 1, text: 'We make it easier for communities to find dependable help and for skilled responders to work together. Every situation is different, so we begin by listening, coordinate the right support, and stay connected through recovery.' }] }] } },
        values: [
          { title: 'Rescue', description: 'Help people reach safety and connect with timely response.' },
          { title: 'Protect', description: 'Work alongside local communities with care and respect.' },
          { title: 'Rebuild', description: 'Support neighbors as they recover and move forward.' },
        ],
      },
      { blockType: 'callToAction', heading: 'Let’s make a difference together.', description: 'Connect with our team to discuss community support and partnerships.', buttonLabel: 'Contact us', buttonUrl: '/contact' },
    ],
  },
  {
    title: 'Services',
    slug: 'services',
    pageType: 'services',
    heroTitle: 'Hero services, ready when it matters.',
    heroDescription: 'Rescue, protection, and recovery services built around the needs of our community.',
    layout: [
      { blockType: 'hero', eyebrow: 'How we help', heading: 'Hero services, ready when it matters.', description: 'Rescue, protection, and recovery services built around the needs of our community.' },
      { blockType: 'servicesGrid', heading: 'Explore our services', intro: 'Choose a service to learn what support is available and how to get started.', limit: 30 },
      { blockType: 'faqSection', heading: 'Questions about getting help?', intro: 'Our team can help you find the right next step.', items: [
        { question: 'How do I request support?', answer: { root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children: [{ type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0, textFormat: 0, textStyle: '', children: [{ type: 'text', version: 1, text: 'Visit our contact page and tell us what is happening. Our team will review your request and follow up with the next steps.' }] }] } } },
        { question: 'Can my organization partner with Superhero HQ?', answer: { root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children: [{ type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0, textFormat: 0, textStyle: '', children: [{ type: 'text', version: 1, text: 'Yes. Contact us with a little information about your organization and the community you serve.' }] }] } } },
      ] },
      { blockType: 'callToAction', heading: 'Need help choosing a service?', description: 'Tell us what you need and we will help you find the right team.', buttonLabel: 'Talk to our team', buttonUrl: '/contact' },
    ],
  },
  {
    title: 'Superheroes',
    slug: 'superheroes',
    pageType: 'superheroes',
    heroTitle: 'Meet our superheroes.',
    heroDescription: 'Rescuers, protectors, and neighbors working together to make every day safer.',
    layout: [
      { blockType: 'hero', eyebrow: 'The people who answer the call', heading: 'Meet our superheroes.', description: 'Rescuers, protectors, and neighbors working together to make every day safer.' },
      { blockType: 'superheroesGrid', heading: 'Our hero network', intro: 'Meet the people bringing skill, courage, and care to their communities.', limit: 12 },
      { blockType: 'callToAction', heading: 'Have a skill that could help?', description: 'Get in touch to learn about joining or supporting the hero network.', buttonLabel: 'Connect with us', buttonUrl: '/contact' },
    ],
  },
  {
    title: 'Insights',
    slug: 'insights',
    pageType: 'insights',
    heroTitle: 'Stories from the city.',
    heroDescription: 'Hero updates, rescue reports, and community stories from across our network.',
    layout: [
      { blockType: 'hero', eyebrow: 'Dispatches from the network', heading: 'Stories from the city.', description: 'Hero updates, rescue reports, and community stories from across our network.' },
      { blockType: 'postsGrid', heading: 'Latest stories and updates', intro: 'Read news, field notes, and ideas from our community.', limit: 50 },
    ],
  },
  {
    title: 'Contact',
    slug: 'contact',
    pageType: 'contact',
    heroTitle: 'Tell us where help is needed.',
    heroDescription: 'For service requests, community partnerships, or general questions, send our team a message.',
    layout: [
      { blockType: 'faqSection', heading: 'Before you reach out', intro: 'A few details can help our team direct your message.', items: [
        { question: 'What should I include in my message?', answer: { root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children: [{ type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0, textFormat: 0, textStyle: '', children: [{ type: 'text', version: 1, text: 'Share how we can reach you, where support is needed, and any details that will help us understand your request.' }] }] } } },
        { question: 'Can I ask about a partnership?', answer: { root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children: [{ type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0, textFormat: 0, textStyle: '', children: [{ type: 'text', version: 1, text: 'Yes. Choose general questions and mention your organization and the community you hope to support.' }] }] } } },
      ] },
    ],
  },
]

const payload = await getPayload({ config })

try {
  for (const page of pageContent) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    const current = existing.docs[0]
    if (current) {
      const missingContent: Record<string, unknown> = {}
      if (!current.heroTitle) missingContent.heroTitle = page.heroTitle
      if (!current.heroDescription) missingContent.heroDescription = page.heroDescription
      if (!current.layout?.length) missingContent.layout = page.layout
      if (current.status !== 'published') missingContent.status = 'published'
      if (current._status !== 'published') missingContent._status = 'published'

      if (Object.keys(missingContent).length) {
        await payload.update({
          collection: 'pages',
          id: current.id,
          data: missingContent as never,
          overrideAccess: true,
        })
        console.log(`Filled missing CMS content: ${page.title}`)
      } else {
        console.log(`Kept existing published CMS page: ${page.title}`)
      }
      continue
    }

    await payload.create({ collection: 'pages', data: { ...page, status: 'published', _status: 'published' } as never, overrideAccess: true })
    console.log(`Created published CMS page: ${page.title}`)
  }

  const allPages = await payload.find({ collection: 'pages', limit: 100, depth: 0, overrideAccess: true })
  for (const page of allPages.docs) {
    if (page.status === 'draft' && page._status === 'published') {
      await payload.update({
        collection: 'pages',
        id: page.id,
        data: { _status: 'draft' } as never,
        overrideAccess: true,
      })
      console.log(`Corrected draft publication status: ${page.title} (${page.slug})`)
    }
  }

  await payload.updateGlobal({
    slug: 'header',
    data: {
      ctaUrl: '/contact#contact-form',
      navigation: [
        { label: 'Home', url: '/' },
        { label: 'About', url: '/about' },
        { label: 'Services', url: '/services' },
        { label: 'Superheroes', url: '/superheroes' },
        { label: 'Insights', url: '/insights' },
        { label: 'Contact', url: '/contact' },
      ],
    },
    overrideAccess: true,
  })
  console.log('Updated Website Header navigation links.')
} finally {
  await payload.destroy()
}
