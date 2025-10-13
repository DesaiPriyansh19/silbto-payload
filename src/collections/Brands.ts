import type { CollectionConfig } from 'payload'

export const Brands: CollectionConfig = {
  slug: 'brands', // <-- this slug must match the relationship
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
