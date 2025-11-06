import { CollectionConfig } from 'payload'

const SalesOrders: CollectionConfig = {
  slug: 'sales-orders',
  fields: [
    {
      name: 'referenceNumber',
      type: 'text',
    },
    {
      name: 'products',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'text',
        },
        {
          name: 'quantity',
          type: 'number',
        },
      ],
    },
  ],
}

export default SalesOrders
