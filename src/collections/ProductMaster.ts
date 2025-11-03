import { CollectionConfig } from 'payload'

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
      label: 'Subcategories / Dropdown Groups',
      type: 'array',
      labels: { singular: 'Dropdown', plural: 'Dropdowns' },
      fields: [
        {
          name: 'dropdownName',
          label: 'Dropdown Name',
          type: 'text',
          required: true,
        },
        {
          name: 'isMultiSelect',
          label: 'Allow Multiple Selection (Used as Checkboxes in Product)',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'If enabled, this dropdown will be shown as checkboxes when creating a product.',
          },
        },
        {
          name: 'options',
          label: 'Available Options',
          type: 'array',
          labels: { singular: 'Option', plural: 'Options' },
          fields: [
            {
              name: 'value',
              label: 'Option Value',
              type: 'text',
              required: true,
            },
            {
              name: 'isSelected',
              label: 'Default Selected',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'If enabled, this option will be selected by default when creating a product.',
              },
            },
          ],
        },
      ],
    },
  ],
}

export default ProductMaster
