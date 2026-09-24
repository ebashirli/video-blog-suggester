import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z.string().min(32, 'SECRET must be at least 32 characters').default('BH3EhK6M9dG5ex+JWiozk5MigvxPv+kT6c8TQmEn6Sg='),
    DATABASE_URL: z.url(),
    GITHUB_CLIENT_ID: z.string().min(1, 'GitHub Client ID is required'),
    GITHUB_CLIENT_SECRET: z.string().min(1, 'GitHub Client Secret is required'),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.url(),
  },
  runtimeEnv: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
})
