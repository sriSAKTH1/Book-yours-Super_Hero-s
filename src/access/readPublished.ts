
import type { Access, Where } from 'payload'

const publishedContent: Where = {
  or: [
    { _status: { equals: 'published' } },
    { status: { equals: 'published' } },
  ],
}

export const readPublished: Access = ({ req }) => {
  // Only content editors can preview drafts.
  if (req.user?.role === 'admin' || req.user?.role === 'editor') {
    return true
  }

  // Public visitors can read published content only.
  return publishedContent
}
