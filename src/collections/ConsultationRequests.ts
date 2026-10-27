
import type { CollectionConfig } from 'payload'

export const ConsultationRequests: CollectionConfig = {
  slug: 'consultation-requests',

  admin: {
    useAsTitle: 'name',
    defaultColumns: [
      'name',
      'consultationType',
      'preferredDate',
      'status',
    ],
    group: 'Inquiries',
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
    {
      name: 'name',
      type: 'text',
      required: true,
    },
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
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
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
