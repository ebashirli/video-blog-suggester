import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || 'test',
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  database: drizzleAdapter(undefined, {
    provider: 'sqlite',
  }),

  emailVerification: {
    sendVerificationEmail: async (params) => {},
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || 'test',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'test',
    },
  },

  session: {
    expiresIn: 604800,
  },

  account: {
    accountLinking: {
      enabled: true,
    },
  },
})
