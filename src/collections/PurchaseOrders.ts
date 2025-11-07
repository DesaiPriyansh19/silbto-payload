import type { CollectionConfig, PayloadRequest } from 'payload'

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
      label: 'PO Number',
      type: 'text',
      unique: true,
      required: true,
    },
    {
      name: 'vendor',
      label: 'Vendor',
      type: 'relationship',
      relationTo: 'vendors',
      required: true,
    },
    {
      name: 'vendorInvoiceNumber',
      label: 'Vendor Invoice No.',
      type: 'text',
    },
    {
      name: 'orderDate',
      label: 'Order Date',
      type: 'date',
      required: true,
    },
    {
      name: 'challanNo',
      label: 'Challan No.',
      type: 'text',
    },
    {
      name: 'challanDate',
      label: 'Challan Date',
      type: 'date',
    },
    {
      name: 'ewayBillNo',
      label: 'E-Way Bill No.',
      type: 'text',
    },
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
        {
          name: 'hsnSac',
          label: 'HSN / SAC Code',
          type: 'text',
        },
        {
          name: 'uom',
          label: 'UOM (Unit of Measurement)',
          type: 'text',
        },
        {
          name: 'quantity',
          label: 'Quantity',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'unitPrice',
          label: 'Unit Price (₹)',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'discount',
          label: 'Discount (%)',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'totalPrice',
          label: 'Total Price (₹)',
          type: 'number',
          admin: { readOnly: true },
        },
        {
          name: 'note',
          label: 'Description / Note',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'subtotal',
      label: 'Subtotal (₹)',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      name: 'taxPercent',
      label: 'Tax (%)',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'taxAmount',
      label: 'Tax Amount (₹)',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      name: 'totalAmount',
      label: 'Total Amount (₹)',
      type: 'number',
      admin: { readOnly: true },
    },
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
      defaultValue: 'credit',
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
    {
      name: 'remarks',
      label: 'Remarks',
      type: 'textarea',
    },
  ],

  hooks: {
    // ✅ Auto Calculate Totals
    beforeChange: [
      async ({ data }) => {
        if (!data?.products) return

        let subtotal = 0
        data.products = data.products.map((p: any) => {
          const qty = Number(p.quantity) || 0
          const price = Number(p.unitPrice) || 0
          const discount = Number(p.discount) || 0

          const total = qty * price * (1 - discount / 100)
          subtotal += total
          return { ...p, totalPrice: total }
        })

        data.subtotal = subtotal
        const taxPercent = Number(data.taxPercent) || 0
        const taxAmount = (subtotal * taxPercent) / 100
        data.taxAmount = taxAmount
        data.totalAmount = subtotal + taxAmount
      },
    ],

    // ✅ Update Inventory After PO is Created
    afterChange: [
      async ({ operation, doc, req }) => {
        if (operation !== 'create') return

        const payload = req.payload

        for (const item of doc.products) {
          const productId = item.product
          const qty = Number(item.quantity)

          if (!productId || !qty) continue

          // 🔹 Find product to get branch/brand
          const product = await payload.findByID({
            collection: 'products',
            id: productId,
          })

          if (!product) continue

          // 🔹 Check if inventory exists for this product & branch
          const existing = await payload.find({
            collection: 'inventory',
            where: {
              and: [{ product: { equals: productId } }, { branch: { equals: product.branch } }],
            },
          })

          if (existing?.docs?.length > 0) {
            const current = existing.docs[0]
            await payload.update({
              collection: 'inventory',
              id: current.id,
              data: {
                currentStock: (current.currentStock || 0) + qty,
                lastUpdated: new Date().toISOString(),
              },
            })
          } else {
            await payload.create({
              collection: 'inventory',
              data: {
                product: productId,
                brand: product.brand,
                branch: product.branch,
                currentStock: qty,
                lastUpdated: new Date().toISOString(),
              },
            })
          }
        }
      },
    ],
  },
}

export default PurchaseOrders
