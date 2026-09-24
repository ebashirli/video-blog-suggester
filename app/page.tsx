'use client'

import LoginButton from '@/components/LoginButton'
import { useSession } from '@/lib/auth/client'

export default function Home() {
  const { data: session, isPending } = useSession()

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 text-center">
        <div>
          <h1 className="mb-4 max-w-2xl text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
            Welcome to Video Blog Suggester
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Sign in with your GitHub account to get started with personalized video blog recommendations.
          </p>
        </div>

        {isPending && (
          <div className="mt-8 rounded-lg bg-gray-200 px-6 py-3 text-gray-500 dark:bg-zinc-800">
            Checking session...
          </div>
        )}

        {!isPending && session?.user && (
          <div className="flex items-center gap-4 mt-8 rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-900/50 sm:p-12">
            <img
              src={session.user.image || 'https://github.com/shadcn.png'}
              alt={session.user.name || 'User'}
              className="h-24 w-24 rounded-full border-4 border-gray-100 dark:border-zinc-800"
            />
            <div className="flex flex-col items-start">
              <p className="text-sm text-gray-500 dark:text-zinc-500">Welcome back,</p>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {session.user.name || session.user.email}
              </h2>
              {session.user.email && (
                <p className="text-sm text-gray-600 dark:text-zinc-400">{session.user.email}</p>
              )}
            </div>
          </div>
        )}

        {!isPending && (
          <div className="mt-8">
            <LoginButton />
          </div>
        )}
      </main>
    </div>
  )
}
