
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },

  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 800,
        height: 600,
        position: 'centre',
      },
    ],
  },

  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alternative Text',
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
