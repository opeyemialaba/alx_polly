'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  /**
   * @summary Main landing page for authenticated users.
   *
   * @description This client-side component serves as the entry point for authenticated users.
   * It checks the user's authentication status using the `useAuth` hook and redirects
   * unauthenticated users to the login page. For authenticated users, it displays a welcome
   * message, a logout button, and links to other parts of the application, such as the polls page.
   *
   * @returns A React functional component that renders the home page content based on authentication status.
   *
   * @connections
   * - **`./auth/auth-context`**: Consumes the `AuthContext` via `useAuth` to get the current user and loading state.
   * - **`next/navigation`**: Uses `useRouter` for programmatic navigation (e.g., redirecting to login).
   * - **`@/lib/supabase`**: Used for the `signOut` action to log the user out.
   * - **`@/components/ui/button`**: `shadcn/ui` button component for the logout action.
   * - **Next.js Link**: For navigation to the polls page.
   */
  const { user, loading } = useAuth() // Get the current user and authentication loading status from the AuthContext.
  const router = useRouter() // Next.js router hook for navigation.

  useEffect(() => {
    // Redirect unauthenticated users to the login page once loading is complete.
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router]) // Dependencies: user, loading, and router to re-run effect when these change.

  const handleLogout = async () => {
    await supabase.auth.signOut() // Sign out the user using Supabase authentication.
    router.push('/auth/login') // Redirect to the login page after successful logout.
  }

  // Display a loading message while authentication status is being determined.
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  // If no user is authenticated after loading, return null (redirection is handled by useEffect).
  if (!user) {
    return null // or a loading spinner, as the redirect will happen in useEffect
  }

  return (
    // Main container for the home page content.
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Welcome message displaying the user's email. */}
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.email}!</h1>
      {/* Logout button. */}
      <Button onClick={handleLogout}>Logout</Button>
      {/* Information and navigation to polls page. */}
      <div className="mt-8 text-center">
        <p className="text-lg">You are logged in. You can now access protected content.</p>
        <p className="text-md mt-2">
          Go to the <Link href="/polls" className="text-blue-500 hover:underline">Polls Page</Link> to view and create polls.
        </p>
      </div>
    </div>
  )
}
