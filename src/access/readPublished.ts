
import type { Access } from 'payload'

export const readPublished: Access = ({ req }) => {
  // Only content editors can preview drafts.
  if (req.user?.role === 'admin' || req.user?.role === 'editor') {
    return true
  }

  // Public visitors can read published content only.
  return {
    status: {
      equals: 'published',
    },
  }
}
