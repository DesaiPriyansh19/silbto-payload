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
      name: 'items', // matches your frontend now
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
      async ({ req, data }: { req: PayloadRequest; data: any }) => {
        const user = req.user as {
          id: string
          brand?: string | { id: string }
          branches?: (string | { id: string })[]
        }

        // ✅ Attach brand automatically
        if (user?.brand) {
          if (typeof user.brand === 'object' && user.brand.id) {
            data.brand = user.brand.id
          } else if (typeof user.brand === 'string') {
            data.brand = user.brand
          }
        }

        // ✅ Attach branch automatically (safe for array)
        if (user?.branches && Array.isArray(user.branches) && user.branches.length > 0) {
          const firstBranch = user.branches[0]
          if (typeof firstBranch === 'object' && firstBranch.id) {
            data.branch = firstBranch.id
          } else if (typeof firstBranch === 'string') {
            data.branch = firstBranch
          }
        }
      },
    ],
  },
}
