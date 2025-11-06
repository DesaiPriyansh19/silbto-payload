import type { CollectionConfig } from 'payload'

export const Inventory: CollectionConfig = {
  slug: 'inventory',
  labels: {
    singular: 'Inventory Item',
    plural: 'Inventory',
  },
  admin: {
    useAsTitle: 'product',
    group: 'Products',
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      unique: true,
    },
    {
      name: 'currentStock',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'lastUpdated',
      type: 'date',
      admin: { readOnly: true },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        data.lastUpdated = new Date()
      },
    ],
  },
}
