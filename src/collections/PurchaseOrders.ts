import { CollectionConfig } from 'payload'

const PurchaseOrders: CollectionConfig = {
  slug: 'purchase-orders',
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

export default PurchaseOrders
