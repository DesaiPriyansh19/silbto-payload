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
      relationTo: 'brands',
      required: true,
    },
    {
      name: 'branches',
      type: 'relationship',
      relationTo: 'branches',
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
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      defaultValue: 'active',
      required: true,
    },
  ],

  // 👇 Hook to prevent inactive users from logging in
  hooks: {
    beforeLogin: [
      async ({ user }) => {
        if (user.status === 'inactive') {
          const err = new Error('Your account is inactive. Please contact admin.')
          ;(err as any).status = 401 // ensures frontend gets it as a client error
          throw err
        }
      },
    ],
  },
}
