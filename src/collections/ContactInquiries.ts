
import type { CollectionConfig } from 'payload'
import { twoColumnRow } from '../lib/twoColumnRow'

export const ContactInquiries: CollectionConfig = {
  slug: 'contact-inquiries',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['status', 'name', 'email', 'createdAt'],
    group: false,
    components: { edit: { beforeDocumentControls: ['@/components/fields/CollectionStatusControl#CollectionStatusControl'] } },
  },

  access: {
    read: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    twoColumnRow(
      { name: 'name', type: 'text', required: true },
      {
        name: 'status', type: 'select', required: true, defaultValue: 'new',
        admin: { hidden: true },
        options: [
          { label: 'New', value: 'new' },
          { label: 'In Progress', value: 'in-progress' },
          { label: 'Resolved', value: 'resolved' },
        ],
      },
    ),
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      access: {
        read: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
        update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
      },
    },
  ],
}
