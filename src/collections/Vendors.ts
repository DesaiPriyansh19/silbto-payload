import { CollectionConfig } from 'payload'

export const Vendors: CollectionConfig = {
  slug: 'vendors',
  labels: {
    singular: 'Vendor',
    plural: 'Vendors',
  },
  admin: {
    useAsTitle: 'companyName',
  },
  fields: [
    {
      name: 'companyName',
      label: 'Company Name',
      type: 'text',
      required: true,
    },
    {
      name: 'contactPerson',
      label: 'Contact Person',
      type: 'text',
      required: true,
    },
    {
      name: 'contactNumber',
      label: 'Contact Number',
      type: 'text',
      required: true,
      validate: (value: unknown) => {
        if (typeof value === 'string' && !/^[0-9]{10}$/.test(value)) {
          return 'Please enter a valid 10-digit contact number'
        }
        return true
      },
    },
    {
      name: 'gstNumber',
      label: 'GST Number',
      type: 'text',
      required: true,
      validate: (value: unknown) => {
        if (typeof value === 'string' && !/^[0-9A-Z]{15}$/.test(value)) {
          return 'Please enter a valid GST number'
        }
        return true
      },
    },
    {
      name: 'address',
      label: 'Address',
      type: 'textarea',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: false,
    },
  ],
}
