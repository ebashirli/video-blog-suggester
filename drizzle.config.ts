import 'dotenv/config'
import { serverEnv } from './data/serverEnv'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    out: '../db/migrations',
    schema: './db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: serverEnv.DATABASE_URL,
    }
})