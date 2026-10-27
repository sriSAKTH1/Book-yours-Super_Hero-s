
import type { CollectionConfig } from 'payload'
import { readPublished } from '../access/readPublished'

export const Services: CollectionConfig = {
  slug: 'services',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'updatedAt'],
    group: 'Superhero Content',
  },

  access: {
    read: readPublished,
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Hero service name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'category',
      type: 'text',
      label: 'Service category',
      admin: {
        description: 'Optional heading used to group services on the Services page.',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      label: 'Service summary',
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Optional icon name used by the frontend.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
}
