import { CollectionConfig } from 'payload'

const PurchaseOrders: CollectionConfig = {
  slug: 'purchase-orders',
  labels: {
    singular: 'Purchase Order',
    plural: 'Purchase Orders',
  },
  admin: {
    useAsTitle: 'referenceNumber',
    defaultColumns: [
      'referenceNumber',
      'vendor',
      'orderDate',
      'totalAmount',
      'paymentType',
      'status',
    ],
  },

  fields: [
    // 🔹 Auto-generated unique internal reference number (PO-0001, PO-0002, ...)
    {
      name: 'referenceNumber',
      type: 'text',
      unique: true,
      admin: { readOnly: true },
      hooks: {
        beforeValidate: [
          async ({ value, req }) => {
            if (value) return value // keep if already exists
            const lastPO = await req.payload.find({
              collection: 'purchase-orders',
              sort: '-createdAt',
              limit: 1,
            })

            let nextNumber = 1
            if (lastPO?.docs?.length > 0) {
              const lastRef = lastPO.docs[0].referenceNumber as string
              const match = lastRef?.match(/PO-(\d+)/)
              if (match) {
                nextNumber = parseInt(match[1]) + 1
              }
            }

            return `PO-${String(nextNumber).padStart(4, '0')}`
          },
        ],
      },
    },

    // 🔹 Vendor Invoice
    {
      name: 'vendorInvoiceNumber',
      label: 'Vendor Invoice Number',
      type: 'text',
      required: true,
    },

    // 🔹 Vendor
    {
      name: 'vendor',
      label: 'Vendor',
      type: 'relationship',
      relationTo: 'vendors',
      required: true,
    },

    // 🔹 Order Date
    {
      name: 'orderDate',
      label: 'Order Date',
      type: 'date',
      required: true,
    },

    // 🔹 Challan & E-way details
    { name: 'challanNo', label: 'Challan No.', type: 'text' },
    { name: 'challanDate', label: 'Challan Date', type: 'date' },
    { name: 'ewayBillNo', label: 'E-Way Bill No.', type: 'text' },

    // 🔹 Product List
    {
      name: 'products',
      label: 'Products',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          label: 'Product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        { name: 'productId', label: 'Product ID / Vendor Code', type: 'text' },
        { name: 'description', label: 'Description / Note', type: 'textarea' },
        {
          name: 'uom',
          label: 'Unit of Measurement (UOM)',
          type: 'text',
          admin: { placeholder: 'e.g., kg, pcs, ml, box' },
        },
        { name: 'hsnSac', label: 'HSN / SAC Code', type: 'text' },
        { name: 'quantity', label: 'Quantity', type: 'number', required: true },
        {
          name: 'unitPrice',
          label: 'Unit Price (₹)',
          type: 'number',
          required: true,
        },
        { name: 'discount', label: 'Discount (₹)', type: 'number' },
        {
          name: 'totalPrice',
          label: 'Total Price (₹)',
          type: 'number',
          admin: { readOnly: true },
          hooks: {
            beforeChange: [
              ({ data }) => {
                if (data) {
                  const qty = data.quantity || 0
                  const price = data.unitPrice || 0
                  const discount = data.discount || 0
                  return qty * price - discount
                }
                return 0
              },
            ],
          },
        },
      ],
    },

    // 🔹 Totals
    { name: 'subtotal', type: 'number', admin: { readOnly: true } },
    { name: 'taxPercent', label: 'Tax (%)', type: 'number' },
    { name: 'taxAmount', label: 'Tax Amount (₹)', type: 'number', admin: { readOnly: true } },
    { name: 'totalAmount', label: 'Grand Total (₹)', type: 'number', admin: { readOnly: true } },

    // 🔹 Payment
    {
      name: 'paymentType',
      label: 'Payment Type',
      type: 'select',
      options: [
        { label: 'Credit', value: 'credit' },
        { label: 'Cash', value: 'cash' },
        { label: 'Cheque', value: 'cheque' },
        { label: 'Online', value: 'online' },
      ],
    },
    {
      name: 'paymentStatus',
      label: 'Payment Status',
      type: 'select',
      options: [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Partially Paid', value: 'partial' },
        { label: 'Paid', value: 'paid' },
      ],
      defaultValue: 'unpaid',
    },

    // 🔹 Order Status
    {
      name: 'status',
      label: 'Order Status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Received', value: 'received' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'pending',
    },
    { name: 'remarks', label: 'Remarks / Notes', type: 'textarea' },
  ],

  // 🔹 Auto total calculation before save
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (!data) return data

        if (Array.isArray(data.products)) {
          const subtotal = data.products.reduce((sum, item) => {
            const qty = item.quantity || 0
            const price = item.unitPrice || 0
            const disc = item.discount || 0
            return sum + qty * price - disc
          }, 0)

          const taxPercent = data.taxPercent || 0
          const taxAmount = subtotal * (taxPercent / 100)
          const total = subtotal + taxAmount

          data.subtotal = subtotal
          data.taxAmount = taxAmount
          data.totalAmount = total
        }

        return data
      },
    ],
  },

  timestamps: true,
}

export default PurchaseOrders
