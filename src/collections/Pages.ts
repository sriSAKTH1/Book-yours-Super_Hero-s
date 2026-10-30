
import type { CollectionConfig, Where } from 'payload'
import { AboutBlock } from '../blocks/About'
import { CallToActionBlock } from '../blocks/CallToAction'
import { FAQsBlock } from '../blocks/FAQs'
import { HeroBlock } from '../blocks/Hero'
import { ImageTextBlock } from '../blocks/ImageText'
import { PostsBlock } from '../blocks/Posts'
import { ServicesBlock } from '../blocks/Services'
import { SuperheroesBlock } from '../blocks/Superheroes'

export const Pages: CollectionConfig = {
  slug: 'pages',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['_status', 'title', 'slug', 'updatedAt'],
    ///group: 'Superhero Content',
  },

  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin' || req.user?.role === 'editor') return true

      const publishedPages: Where = {
        or: [{ _status: { equals: 'published' } }, { status: { equals: 'published' } }],
      }
      return publishedPages
    },

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

  versions: {
    drafts: true,
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
      name: 'pageType',
      type: 'select',
      required: true,
      defaultValue: 'standard',
      options: [
        { label: 'Home', value: 'home' },
        { label: 'About', value: 'about' },
        { label: 'Contact', value: 'contact' },
        { label: 'Services', value: 'services' },
        { label: 'Superheroes', value: 'superheroes' },
        { label: 'Insights', value: 'insights' },
      ],
    },
    {
      name: 'heroTitle',
      type: 'text',
    },
    {
      name: 'heroDescription',
      type: 'textarea',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Page sections',
      admin: {
        description: 'Add, remove, and reorder sections. The published Home page layout controls the homepage.',
      },
      blocks: [
        HeroBlock,
        ImageTextBlock,
        PostsBlock,
        AboutBlock,
        FAQsBlock,
        ServicesBlock,
        SuperheroesBlock,
        CallToActionBlock,
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      admin: {
        hidden: true,
      },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
}
