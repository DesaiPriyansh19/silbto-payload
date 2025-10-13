import type { CollectionConfig } from 'payload'

export const Branches: CollectionConfig = {
  slug: 'branches', // <-- this slug must match relationship in Users
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands', // must match slug of Brands
      required: true,
    },
    { name: 'location', type: 'text' },
  ],
}
