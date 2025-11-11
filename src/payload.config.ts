// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Branches } from './collections/Branches'
import { Brands } from './collections/Brands'
import { Clients } from './collections/Clients'
import { FamilyGroups } from './collections/FamilyGroups'
import ProductMaster from './collections/ProductMaster'
import { Vendors } from './collections/Vendors'
import { Products } from './collections/Product'

import { Inventory } from './collections/Inventory'
import PurchaseOrders from './collections/PurchaseOrders'
import SalesOrders from './collections/SalesOrders'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Branches,
    Brands,
    Clients,
    FamilyGroups,
    ProductMaster,
    Products,
    Vendors,
    PurchaseOrders,
    SalesOrders,
    Inventory,
  ],
  cors: [
    'http://localhost:3000', // dev frontend
    'http://localhost:3001', // dev frontend alternate
    'https://silibto.vercel.app', // live frontend
  ],
  // ✅ Also required for POST requests like login
  // csrf: ['http://localhost:3000', 'http://localhost:3001', 'https://silibto.vercel.app'],

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
