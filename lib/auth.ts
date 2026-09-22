import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db/db'
import { env } from './env'

// Disable schema validation for development with SQLite
const isDev = process.env.NODE_ENV === 'development'
const useSqlite = process.env.USE_SQLITE === 'true' || isDev

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  database: drizzleAdapter(db, {
    provider: 'sqlite' as const,
  }),

  emailVerification: {
    sendVerificationEmail: async (params) => {
      // Optional: implement custom email verification logic
    },
  },

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
