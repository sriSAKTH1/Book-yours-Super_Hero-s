
import type { CollectionConfig } from 'payload'
import { readPublished } from '../access/readPublished'

export const Posts: CollectionConfig = {
  slug: 'posts',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'publishedAt'],
    group: 'Superhero Content',
  },

    access: {
    read: readPublished,

    create: ({ req }) =>
        req.user?.role === 'admin' ||
        req.user?.role === 'editor',

    update: ({ req }) =>
        req.user?.role === 'admin' ||
        req.user?.role === 'editor',

    delete: ({ req }) =>
        req.user?.role === 'admin' ||
        req.user?.role === 'editor',
    },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short summary displayed on article cards.',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'developers',
      type: 'relationship',
      relationTo: 'developers',
      label: 'Featured superhero',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Hero Dispatches', value: 'legal-guides' },
        { label: 'Team Updates', value: 'firm-news' },
        { label: 'Rescue Reports', value: 'case-updates' },
        { label: 'Community Insights', value: 'legal-insights' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
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
