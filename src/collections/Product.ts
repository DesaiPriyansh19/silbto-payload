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
      required: true,
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'category',
      label: 'Category',
      type: 'relationship',
      relationTo: 'product-master',
      required: true,
      hasMany: false,
    },
    {
      name: 'attributes',
      label: 'Category Attributes (Dynamic)',
      type: 'json',
      admin: {
        description:
          'Stores dynamic dropdown selections (single or multi). Example: {"Size": ["M","L"], "Color": "Red"}',
      },
    },
  ],

  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        const payload = req.payload

        if (operation !== 'create' && operation !== 'update') return

        // check if inventory entry exists
        const existing = await payload.find({
          collection: 'inventory',
          where: { product: { equals: doc.id } },
        })

        const isoDate = new Date().toISOString() // ✅ TS-safe string format

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
