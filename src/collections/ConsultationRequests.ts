
import type { CollectionConfig } from 'payload'
import { twoColumnRow } from '../lib/twoColumnRow'

export const ConsultationRequests: CollectionConfig = {
  slug: 'consultation-requests',

  admin: {
    useAsTitle: 'name',
    defaultColumns: [
      'status',
      'name',
      'consultationType',
      'preferredDate',
    ],
    group: false,
    components: { edit: { beforeDocumentControls: ['@/components/fields/CollectionStatusControl#CollectionStatusControl'] } },
  },

  access: {
    read: ({ req }) =>
      req.user?.role === 'admin' || req.user?.role === 'editor',
    create: ({ req }) =>
      req.user?.role === 'admin' || req.user?.role === 'editor',
    update: ({ req }) =>
      req.user?.role === 'admin' || req.user?.role === 'editor',
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
          { label: 'Contacted', value: 'contacted' },
          { label: 'Scheduled', value: 'scheduled' },
          { label: 'Completed', value: 'completed' },
          { label: 'Cancelled', value: 'cancelled' },
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
      required: true,
    },
    {
      name: 'consultationType',
      type: 'select',
      required: true,
      options: [
        { label: 'Community response request', value: 'general' },
        { label: 'Community feedback', value: 'feedback' },
        { label: 'Hero service or partnership', value: 'service-inquiry' },
      ],
    },
    {
      name: 'preferredDate',
      type: 'date',
    },
    {
      name: 'preferredTime',
      type: 'select',
      options: [
        { label: 'Morning', value: 'morning' },
        { label: 'Afternoon', value: 'afternoon' },
        { label: 'Evening', value: 'evening' },
      ],
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
        read: ({ req }) =>
          req.user?.role === 'admin' || req.user?.role === 'editor',
        update: ({ req }) =>
          req.user?.role === 'admin' || req.user?.role === 'editor',
      },
    },
  ],
}
