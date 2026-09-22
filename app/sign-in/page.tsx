import { redirect } from 'next/navigation'
import LoginButton from '@/components/LoginButton'

export default function SignInPage() {
  // This page will be redirected to login
  redirect('/sign-in')
}
