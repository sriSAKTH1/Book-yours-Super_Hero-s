const pageRoutes: Record<string, string> = {
  home: '/',
  about: '/about',
  contact: '/contact',
  services: '/services',
  superheroes: '/superheroes',
  insights: '/insights',
}

function getString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function collectText(value: unknown, key = ''): string[] {
  if (Array.isArray(value)) return value.flatMap((item) => collectText(item, key))
  if (!value || typeof value !== 'object') {
    return typeof value === 'string' && (key === 'text' || [
      'heading', 'title', 'description', 'intro', 'eyebrow', 'question', 'answer', 'body', 'label',
    ].includes(key)) ? [value.trim()] : []
  }

  return Object.entries(value).flatMap(([childKey, child]) => collectText(child, childKey))
}

function plainText(value: unknown): string {
  return collectText(value).join(' ').replace(/\s+/g, ' ').trim()
}

export function getSearchResultURL(collectionSlug: string, doc: Record<string, unknown>): string | null {
  const slug = getString(doc.slug)

  if (collectionSlug === 'pages') {
    const pageType = getString(doc.pageType)
    return pageRoutes[pageType] ?? null
  }

  if (!slug) return null
  if (collectionSlug === 'services') return `/services/${encodeURIComponent(slug)}`
  if (collectionSlug === 'developers') return `/superheroes/${encodeURIComponent(slug)}`
  if (collectionSlug === 'posts') return `/insights/${encodeURIComponent(slug)}`
  return null
}

export function isPublishedSearchDocument(collectionSlug: string, doc: Record<string, unknown>): boolean {
  if (collectionSlug === 'pages') {
    return doc._status === 'published' || doc.status === 'published'
  }

  return doc.status === 'published'
}

export function getSearchExcerpt(collectionSlug: string, doc: Record<string, unknown>): string {
  let parts: string[]

  switch (collectionSlug) {
    case 'pages':
      parts = [getString(doc.heroTitle), getString(doc.heroDescription), plainText(doc.layout)]
      break
    case 'services':
      parts = [getString(doc.shortDescription), getString(doc.category), plainText(doc.description)]
      break
    case 'developers':
      parts = [getString(doc.jobTitle), getString(doc.skills), plainText(doc.biography)]
      break
    case 'posts':
      parts = [getString(doc.excerpt), getString(doc.category), plainText(doc.content)]
      break
    default:
      parts = []
  }

  return parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim().slice(0, 500)
}
