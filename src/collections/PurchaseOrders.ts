import type { CollectionConfig, PayloadRequest } from 'payload'

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
  fields: [
    {
      name: 'poNumber',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'vendor',
      type: 'relationship',
      relationTo: 'vendors',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products', required: true },
        { name: 'hsnSac', type: 'text' },
        { name: 'uom', type: 'text' },
        { name: 'quantity', type: 'number', required: true },
        { name: 'unitPrice', type: 'number', required: true },
        { name: 'discount', type: 'number' },
        { name: 'totalPrice', type: 'number', required: true },
        { name: 'note', type: 'textarea' },
      ],
    },
    { name: 'subtotal', type: 'number' },
    { name: 'taxPercent', type: 'number' },
    { name: 'taxAmount', type: 'number' },
    { name: 'totalAmount', type: 'number' },
    { name: 'paymentType', type: 'text' },
    { name: 'paymentStatus', type: 'select', options: ['Paid', 'Pending'] },
    { name: 'remarks', type: 'textarea' },

    // ✅ Brand (admin can select, user auto)
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      required: true,
      admin: {
        condition: () => true,
      },
    },

    // ✅ Branch (admin can select, user auto)
    {
      name: 'branch',
      type: 'relationship',
      relationTo: 'branches',
      required: true,
      admin: {
        condition: () => true,
      },
    },
  ],

  hooks: {
    beforeChange: [
      async ({ req, data }: { req: PayloadRequest; data: any }) => {
        const user = req.user as {
          id: string
          role?: string
          brand?: string | { id: string }
          branches?: (string | { id: string })[]
        }

        // 🧠 Only auto-assign if NOT admin
        if (user?.role !== 'admin') {
          // Auto-attach brand
          if (user?.brand) {
            if (typeof user.brand === 'object' && user.brand.id) data.brand = user.brand.id
            else if (typeof user.brand === 'string') data.brand = user.brand
          }

          // Auto-attach first branch
          if (user?.branches?.length) {
            const first = user.branches[0]
            if (typeof first === 'object' && first.id) data.branch = first.id
            else if (typeof first === 'string') data.branch = first
          }
        }

        return data
      },
    ],
  },
}
