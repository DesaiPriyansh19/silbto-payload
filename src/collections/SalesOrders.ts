import type { CollectionConfig } from 'payload'

export const SalesOrders: CollectionConfig = {
  slug: 'sales-orders',
  labels: {
    singular: 'Sales Order',
    plural: 'Sales Orders',
  },
  admin: {
    useAsTitle: 'soNumber',
    group: 'Transactions',
  },
  fields: [
    {
      name: 'soNumber',
      type: 'text',
      unique: true,
      required: true,
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
    },
    {
      name: 'products',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        { name: 'quantity', type: 'number', required: true, min: 1 },
        { name: 'sellingPrice', type: 'number', required: true, min: 0 },
        { name: 'total', type: 'number', admin: { readOnly: true } },
      ],
    },
    {
      name: 'totalAmount',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'pending', 'completed'],
      defaultValue: 'pending',
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'createdAt',
      type: 'date',
      defaultValue: () => new Date(),
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data }) => {
        if (!data) return // ✅ safety check
        if (!data.soNumber) {
          const rand = Math.floor(1000 + Math.random() * 9000)
          data.soNumber = `SO-${new Date().getFullYear()}-${rand}`
        }
      },
    ],

    afterChange: [
      async ({ doc, req }) => {
        if (doc.status === 'completed') {
          const payload = req.payload

          for (const item of doc.products) {
            const productId = item.product.id || item.product

            const inventory = await payload.find({
              collection: 'inventory',
              where: { product: { equals: productId } },
            })

            if (inventory.totalDocs > 0) {
              const existing = inventory.docs[0]
              await payload.update({
                collection: 'inventory',
                id: existing.id,
                data: { currentStock: Math.max((existing.currentStock || 0) - item.quantity, 0) },
              })
            }
          }
        }
      },
    ],
  },
}
