import type { CollectionConfig } from 'payload'

export const PurchaseOrders: CollectionConfig = {
  slug: 'purchase-orders',
  labels: {
    singular: 'Purchase Order',
    plural: 'Purchase Orders',
  },
  admin: {
    useAsTitle: 'poNumber',
    group: 'Purchases',
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'poNumber',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          min: 0,
        },
      ],
    },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'branch',
      type: 'relationship',
      relationTo: 'branches',
      required: true,
      admin: { readOnly: true },
    },
  ],

  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        if (['create', 'update'].includes(operation) && req.user) {
          data.brand = req.user.brand
          data.branch = req.user.branches
        }
        return data
      },
    ],
    afterChange: [
      // 🔄 Update Inventory when PO is created or updated
      async ({ req, doc, operation }) => {
        if (['create', 'update'].includes(operation)) {
          const { items, brand, branch } = doc

          for (const item of items) {
            const productId = item.product
            const quantity = item.quantity

            // ✅ use req.payload instead of payload
            const existingInv = await req.payload.find({
              collection: 'inventory',
              where: {
                and: [{ product: { equals: productId } }, { branch: { equals: branch } }],
              },
            })

            if (existingInv.docs.length > 0) {
              const invDoc = existingInv.docs[0]
              await req.payload.update({
                collection: 'inventory',
                id: invDoc.id,
                data: { currentStock: invDoc.currentStock + quantity },
              })
            } else {
              await req.payload.create({
                collection: 'inventory',
                data: {
                  product: productId,
                  brand,
                  branch,
                  currentStock: quantity,
                },
              })
            }
          }
        }
      },
    ],
  },
}
