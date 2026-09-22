import type { Session } from '@/lib/auth'

// Type inference for better-auth types - extend the built-in module
declare module 'better-auth' {
  interface BetterAuthConfig {
    secret: string
    baseURL: string
  }
}

// Extend session type with user information
export const authUserType = {} as Session['user']
