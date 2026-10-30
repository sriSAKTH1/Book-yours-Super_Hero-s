import type { Block } from 'payload'
import { twoColumnRow } from '../lib/twoColumnRow'

export const SuperheroesBlock: Block = {
  slug: 'superheroesGrid',
  labels: { singular: 'Superheroes grid', plural: 'Superheroes grids' },
  fields: [
    twoColumnRow(
      { name: 'heading', type: 'text', defaultValue: 'Meet the superheroes' },
      { name: 'anchorId', type: 'text', label: 'Section anchor ID' },
    ),
    { name: 'intro', type: 'textarea' },
    twoColumnRow({ name: 'limit', type: 'number', defaultValue: 3, min: 1, max: 12 }),
  ],
}
