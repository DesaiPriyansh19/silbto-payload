import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  fields: [
    { name: 'fullName', type: 'text', required: true },
    { name: 'mobileNumber', type: 'text', required: true },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands', // must match slug of Brands
      required: true,
    },
    {
      name: 'branches',
      type: 'relationship',
      relationTo: 'branches', // must match slug of Branches
      hasMany: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Branch Admin', value: 'branch-admin' },
        { label: 'Employee', value: 'employee' },
      ],
      defaultValue: 'employee',
      required: true,
    },
  ],
}
