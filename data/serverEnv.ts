import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const serverEnv = createEnv({
    server: {
        DATABASE_URL: z.url(),
        BETTER_AUTH_SECRET: z.string(),
        GITHUB_CLIENT_ID: z.string(),
        GITHUB_CLIENT_SECRET: z.string(),

        // BETTER_AUTH_URL
        // NEXT_PUBLIC_APP_URL
    },

    experimental__runtimeEnv: process.env,
    emptyStringAsUndefined: true,
    
    // experimental__runtimeEnv: {
    //     NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
    // }
})