'use client'

import { signIn, signOut, useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginButton() {
  const { data: session } = useSession()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    try {
      await signIn.social({
        provider: 'github',
        callbackURL: '/',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out')
    }
  }

  if (session?.user) {
    return (
      <button
        onClick={handleSignOut}
        className="rounded-lg bg-gray-800 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
      >
        Sign out
      </button>
    )
  }

  return (
    <>
      <button
        onClick={handleSignIn}
        className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-100 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.4-5.25 5.68.42.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .3.21.66.8.55A10.52 10.52 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
        </svg>
        <span>Sign in with GitHub</span>
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </>
  )
}
