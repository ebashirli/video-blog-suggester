import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const clientEnv = createEnv({
    client: {},
    runtimeEnv: {},
    emptyStringAsUndefined: true,
    
    // experimental__runtimeEnv: {
    //     NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
    // }
})  
    