import type { CollectionConfig } from 'payload'

export const FamilyGroups: CollectionConfig = {
  slug: 'family-groups', // API endpoint: /api/family-groups
  labels: {
    singular: 'Family Group',
    plural: 'Family Groups',
  },
  fields: [
    { name: 'headName', type: 'text', required: true }, // maps to "Name of Head Person"
    { name: 'reference', type: 'text' }, // maps to "Reference"
  ],
}
