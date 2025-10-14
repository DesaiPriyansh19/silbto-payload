import type { CollectionConfig } from 'payload'

export const FamilyGroups: CollectionConfig = {
  slug: 'family-groups', // API endpoint: /api/family-groups
  labels: {
    singular: 'Family Group',
    plural: 'Family Groups',
  },
  fields: [
    { name: 'name', type: 'text', required: true }, // e.g., Group A
    { name: 'description', type: 'text' }, // optional extra info
  ],
}
