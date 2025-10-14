import type { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
  slug: 'clients', // API endpoint: /api/clients
  labels: {
    singular: 'Client',
    plural: 'Clients',
  },
  fields: [
    { name: 'firstName', type: 'text', required: true },
    { name: 'middleName', type: 'text' },
    { name: 'surname', type: 'text', required: true },
    {
      name: 'gender',
      type: 'select',
      options: ['Male', 'Female', 'Other'],
      required: true,
    },
    { name: 'phone1', type: 'text', required: true },
    { name: 'phone1Primary', type: 'checkbox' },
    { name: 'phone2', type: 'text' },
    { name: 'phone2Primary', type: 'checkbox' },
    { name: 'address', type: 'text' },
    { name: 'reference', type: 'text' },
    {
      name: 'familyGroup',
      type: 'relationship',
      relationTo: 'family-groups', // matches slug of FamilyGroups
      required: false,
    },
  ],
}
