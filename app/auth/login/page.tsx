'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function LoginPage() {
  /**
   * @summary Handles user login functionality.
   *
   * @description This client-side component provides the user interface and logic for logging into the application.
   * It leverages Supabase's `signInWithPassword` method for authentication and `next/navigation`'s `useRouter`
   * to redirect authenticated users to the home page or display errors.
   * Being a client component, it uses React's `useState` for managing form input and error states.
   *
   * @returns A React functional component that renders the login form.
   *
   * @connections
   * - **`@/lib/supabase`**: Imports the Supabase client to interact with the authentication service.
   * - **`next/navigation`**: Uses `useRouter` for programmatic navigation after login or signup.
   * - **`@/components/ui/card`**: Utilizes `shadcn/ui` Card components for consistent UI presentation.
   * - **`@/components/ui/label`**, **`@/components/ui/input`**, **`@/components/ui/button`**: `shadcn/ui` components for form elements.
   * - **`/auth/signup`**: Provides a link to the signup page for new users.
   */
  const [email, setEmail] = useState('') // State to store the user's email input.
  const [password, setPassword] = useState('') // State to store the user's password input.
  const [error, setError] = useState<string | null>(null) // State to store any login error messages.
  const router = useRouter() // Next.js router hook for navigation.

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent default form submission behavior.
    setError(null) // Clear any previous errors.

    // Attempt to sign in the user with provided email and password using Supabase.
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message) // If an error occurs, set the error state to display to the user.
    } else {
      router.push('/') // On successful login, redirect the user to the home page.
    }
  }

  return (
    // Centering container for the login card.
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Login Card component from shadcn/ui. */}
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">Enter your email below to login to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Login form */}
          <form onSubmit={handleLogin} className="grid gap-4">
            {/* Email input field */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {/* Password input field */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* Display error message if present. */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {/* Login button */}
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>
        {/* Link to signup page */}
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="underline">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  )
}
