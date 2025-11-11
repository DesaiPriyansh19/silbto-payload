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
      async ({ req, data }) => {
        const user = req.user as {
          id: string
          brand?: string | { id: string }
          branches?: (string | { id: string })[]
          role?: string
        }

        // ✅ Automatically attach brand
        if (user?.brand) {
          data.brand = typeof user.brand === 'object' ? user.brand.id : user.brand
        }

        // ✅ Automatically attach first branch if user is not admin
        if (user?.role !== 'admin' && Array.isArray(user.branches) && user.branches.length > 0) {
          const firstBranch = user.branches[0]
          data.branch = typeof firstBranch === 'object' ? firstBranch.id : firstBranch
        }

        // ✅ If admin manually selects branch (optional)
        if (user?.role === 'admin' && !data.branch) {
          console.log('⚠️ Admin must select branch manually')
        }

        return data
      },
    ],
  },
}
