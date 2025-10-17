import { CollectionConfig } from 'payload/'

const ProductMaster: CollectionConfig = {
  slug: 'product-master',
  labels: {
    singular: 'Product Category',
    plural: 'Product Categories',
  },
  admin: {
    useAsTitle: 'categoryName',
    group: 'Products',
  },
  fields: [
    {
      name: 'categoryName',
      label: 'Product Category Name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'dropdownGroups',
      label: 'Dropdown Groups',
      type: 'array',
      labels: { singular: 'Dropdown', plural: 'Dropdowns' },
      fields: [
        {
          name: 'dropdownName',
          label: 'Dropdown Name',
          type: 'text',
          required: true,
          unique: false, // unique only inside this category
        },
        {
          name: 'options',
          label: 'Options',
          type: 'array',
          labels: { singular: 'Option', plural: 'Options' },
          fields: [
            {
              name: 'value',
              label: 'Option Value',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}

export default ProductMaster
