import type { CollectionConfig, PayloadRequest } from 'payload'

const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  admin: {
    useAsTitle: 'productName',
    group: 'Products',
  },
  fields: [
    {
      name: 'productName',
      label: 'Product Name',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      label: 'Price (₹)',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'openingStock',
      label: 'Opening Stock',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'category',
      label: 'Category',
      type: 'relationship',
      relationTo: 'product-master',
      required: true,
    },
    {
      name: 'attributes',
      label: 'Category Attributes (Dynamic)',
      type: 'json',
    },

    // 🔹 Auto-link product to brand & branch
    {
      name: 'brand',
      label: 'Brand',
      type: 'relationship',
      relationTo: 'brands',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'branch',
      label: 'Branch',
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

        if (user) {
          // ✅ Brand ID fix
          if (typeof user.brand === 'object' && user.brand.id) {
            data.brand = user.brand.id
          } else if (typeof user.brand === 'string') {
            data.brand = user.brand
          }

          // ✅ Branch ID fix
          if (Array.isArray(user.branches) && user.branches.length === 1) {
            const branch = user.branches[0]
            data.branch = typeof branch === 'object' && branch.id ? branch.id : branch
          }
        }
      },
    ],

    afterChange: [
      async ({ doc, operation, req }) => {
        const payload = req.payload
        if (!['create', 'update'].includes(operation)) return

        const isoDate = new Date().toISOString()

        // 🔹 Check if inventory record exists for this product + branch
        const existing = await payload.find({
          collection: 'inventory',
          where: {
            and: [{ product: { equals: doc.id } }, { branch: { equals: doc.branch } }],
          },
        })

        if (existing?.docs?.length > 0) {
          await payload.update({
            collection: 'inventory',
            id: existing.docs[0].id,
            data: {
              currentStock: doc.openingStock,
              lastUpdated: isoDate,
            },
          })
        } else {
          await payload.create({
            collection: 'inventory',
            data: {
              product: doc.id,
              branch: doc.branch,
              brand: doc.brand,
              currentStock: doc.openingStock,
              lastUpdated: isoDate,
            },
          })
        }
      },
    ],
  },
}

export default Products
