import type { CollectionConfig } from 'payload'

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

    // 🔹 Automatically link product to brand & branch
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
      async ({ req, data }) => {
        // 🔹 Auto-assign brand & branch based on logged-in user
        const user = req.user
        if (user) {
          data.brand = user.brand
          if (user.branches?.length === 1) {
            data.branch = user.branches[0]
          }
        }
      },
    ],

    afterChange: [
      async ({ doc, operation, req }) => {
        const payload = req.payload
        if (operation !== 'create' && operation !== 'update') return

        // Check if inventory record already exists for this product + branch
        const existing = await payload.find({
          collection: 'inventory',
          where: {
            and: [{ product: { equals: doc.id } }, { branch: { equals: doc.branch } }],
          },
        })

        const isoDate = new Date().toISOString()

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
