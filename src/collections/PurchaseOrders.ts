import type { CollectionConfig, PayloadRequest } from 'payload'
import payload from 'payload'

const PurchaseOrders: CollectionConfig = {
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
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      required: true,
      admin: {
        readOnly: true, // always auto-assigned
      },
    },
    {
      name: 'branch',
      type: 'relationship',
      relationTo: 'branches',
      required: true,
      admin: {
        readOnly: false, // admin can select manually
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

        // Auto-attach brand
        if (user?.brand) {
          data.brand = typeof user.brand === 'object' ? user.brand.id : user.brand
        }

        // Auto-attach first branch for non-admin users
        if (user?.role !== 'admin' && Array.isArray(user.branches) && user.branches.length > 0) {
          const firstBranch = user.branches[0]
          data.branch = typeof firstBranch === 'object' ? firstBranch.id : firstBranch
        }

        // Admin can manually select branch, warn if missing
        if (user?.role === 'admin' && !data.branch) {
          console.warn('⚠️ Admin must select branch manually')
        }

        return data
      },
    ],

    afterChange: [
      async ({ doc, req }) => {
        if (!doc?.items) return

        // Update inventory quantities
        for (const item of doc.items) {
          if (!item.product || !item.quantity) continue

          try {
            const productDoc = await payload.findByID({
              collection: 'products',
              id: item.product,
              req,
            })

            const currentQty = Number(productDoc?.quantity || 0)
            const addedQty = Number(item.quantity || 0)

            await payload.update({
              collection: 'products',
              id: item.product,
              data: { quantity: currentQty + addedQty },
              req,
            })
          } catch (err) {
            console.error(`Failed to update product ${item.product} quantity:`, err)
          }
        }
      },
    ],
  },
}

export default PurchaseOrders
