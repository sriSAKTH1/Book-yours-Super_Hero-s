import type { Block } from 'payload'

export const SuperheroesBlock: Block = {
  slug: 'superheroesGrid',
  labels: { singular: 'Superheroes grid', plural: 'Superheroes grids' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Meet the superheroes' },
    { name: 'intro', type: 'textarea' },
    { name: 'anchorId', type: 'text', label: 'Section anchor ID' },
    { name: 'limit', type: 'number', defaultValue: 3, min: 1, max: 12 },
  ],
}
