import { serverEnv } from '@/data/serverEnv'
import { drizzle } from 'drizzle-orm/neon-http'
import { relations } from './realations'

export const db = drizzle(serverEnv.DATABASE_URL, { relations })
