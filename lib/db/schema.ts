import { customType, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// D1's bind() rejects JS Date objects. better-auth's drizzle adapter passes
// Date objects for createdAt/updatedAt on write, so convert Date -> epoch ms
// at the SQL binding layer via toDriver.
const timestamp = customType<{ data: Date | number | null; driverData: number | null }>({
  dataType() {
    return 'integer'
  },
  toDriver(value) {
    return value instanceof Date ? value.getTime() : value
  },
  fromDriver(value) {
    return value === null ? null : new Date(value)
  },
})

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: customType<{ data: boolean | number; driverData: number }>({
    dataType() {
      return 'integer'
    },
    toDriver(value) {
      return value === true ? 1 : value === false ? 0 : value
    },
    fromDriver(value) {
      return value === 1
    },
  })('emailVerified')
    .notNull()
    .default(0),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
})

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
})

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
})
