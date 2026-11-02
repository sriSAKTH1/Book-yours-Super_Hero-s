
import type { CollectionConfig, Where } from 'payload'
import { twoColumnRow } from '../lib/twoColumnRow'

export const Developers: CollectionConfig = {
  slug: 'developers',

  labels: { singular: 'Superhero', plural: 'Superheroes' },

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['status', 'name', 'jobTitle'],
    group: 'Superhero Content',
  },

  versions: { drafts: true },

  hooks: {
    beforeChange: [({ data }) => {
      if (data._status === 'draft' || data._status === 'published') {
        return { ...data, status: data._status }
      }
      return data
    }],
  },

  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin' || req.user?.role === 'editor') {
        return true
      }

      const publishedSuperheroes: Where = {
        or: [
          { _status: { equals: 'published' } },
          { status: { equals: 'published' } },
        ],
      }
      return publishedSuperheroes
    },
    create: ({ req }) =>
      req.user?.role === 'admin' || req.user?.role === 'editor',
    update: ({ req }) =>
      req.user?.role === 'admin' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    twoColumnRow(
      { name: 'name', type: 'text', required: true, label: 'Hero name' },
      {
        name: 'status', type: 'select', required: true, defaultValue: 'draft',
        admin: { hidden: true },
        options: [
          { label: 'Draft', value: 'draft' },
          { label: 'Published', value: 'published' },
        ],
      },
    ),
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'jobTitle',
      type: 'text',
      required: true,
      label: 'Hero role or alias',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero portrait',
    },
    {
      name: 'biography',
      type: 'richText',
      label: 'Origin story',
    },
    {
      name: 'skills',
      type: 'text',
      label: 'Powers and abilities',
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
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
  ],
}
