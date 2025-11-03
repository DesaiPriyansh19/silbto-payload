import { CollectionConfig } from 'payload'

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
      type: 'json', // ✅ allows flexible structure for dynamic attributes
      admin: {
        description:
          'Stores dynamic dropdown selections (single or multi). Example: {"Size": ["M","L"], "Color": "Red"}',
      },
    },
  ],
}

export default Products
