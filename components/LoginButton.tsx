'use client'

import { signIn, signOut, useSession } from '@/lib/auth-client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginButton() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    try {
      await signIn.social({
        provider: 'github',
        callbackURL: window.location.pathname,
      })
    } catch (err: any) {
      console.error('Sign in error:', err)
      setError(err?.message || 'Failed to sign in')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.refresh()
      router.push('/sign-in')
    } catch (err: any) {
      console.error('Sign out error:', err)
      setError(err?.message || 'Failed to sign out')
    }
  }

  if (isPending) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 text-gray-500">
        <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
        <span>Loading...</span>
      </div>
    )
  }

  if (session?.user) {
    return (
      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
      >
        <img
          src={session.user.image || 'https://github.com/shadcn.png'}
          alt={session.user.name || 'User'}
          className="h-6 w-6 rounded-full border border-gray-300 dark:border-gray-700"
        />
        <span>{session.user.name}</span>
      </button>
    )
  }

  return (
    <>
      <Link
        href="/sign-in"
        className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-100 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
      >
        <img
          src="https://github.com/github.svg"
          alt="GitHub"
          className="h-5 w-5"
        />
        <span>Sign in with GitHub</span>
      </Link>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </>
  )
}
