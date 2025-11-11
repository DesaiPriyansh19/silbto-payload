import type { CollectionConfig } from 'payload'

export const Inventory: CollectionConfig = {
  slug: 'inventory',
  labels: {
    singular: 'Inventory Item',
    plural: 'Inventory',
  },
  admin: {
    useAsTitle: 'product',
    group: 'Inventory',
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      required: true,
    },
    {
      name: 'branch',
      type: 'relationship',
      relationTo: 'branches',
      required: true,
    },
    {
      name: 'currentStock',
      type: 'number',
      defaultValue: 0,
      required: true,
    },
  ],
  timestamps: true,
}
