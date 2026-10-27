
import type { CollectionConfig } from 'payload'

export const Developers: CollectionConfig = {
  slug: 'developers',

  labels: { singular: 'Superhero', plural: 'Superheroes' },

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'jobTitle', 'status'],
    group: 'Superhero Content',
  },

  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin' || req.user?.role === 'editor') {
        return true
      }

      return {
        status: {
          equals: 'published',
        },
      }
    },
    create: ({ req }) =>
      req.user?.role === 'admin' || req.user?.role === 'editor',
    update: ({ req }) =>
      req.user?.role === 'admin' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Hero name',
    },
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
