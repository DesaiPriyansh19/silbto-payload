import type { CollectionConfig } from 'payload'

export const PurchaseOrders: CollectionConfig = {
  slug: 'purchase-orders',
  labels: {
    singular: 'Purchase Order',
    plural: 'Purchase Orders',
  },
  admin: {
    useAsTitle: 'poNumber',
    group: 'Transactions',
  },
  fields: [
    {
      name: 'poNumber',
      type: 'text',
      unique: true,
      required: true,
    },
    {
      name: 'vendor',
      type: 'relationship',
      relationTo: 'vendors',
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
        { name: 'purchasePrice', type: 'number', required: true, min: 0 },
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
        if (!data) return // ✅ make sure data exists
        if (!data.poNumber) {
          const rand = Math.floor(1000 + Math.random() * 9000)
          data.poNumber = `PO-${new Date().getFullYear()}-${rand}`
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
                data: { currentStock: existing.currentStock + item.quantity },
              })
            } else {
              await payload.create({
                collection: 'inventory',
                data: { product: productId, currentStock: item.quantity },
              })
            }
          }
        }
      },
    ],
  },
}
