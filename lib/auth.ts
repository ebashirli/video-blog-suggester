import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db/db'
import { env } from './env'
import * as schema from '@/db/schemas/auth'

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),

  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },

  session: {
    expiresIn: 604800, // 7 days in seconds
  },

  account: {
    accountLinking: {
      enabled: true,
    },
  },
})

export type Session = typeof auth.$Infer.Session
