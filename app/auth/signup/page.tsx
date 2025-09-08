'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SignupPage() {
  /**
   * @summary Handles user registration functionality.
   *
   * @description This client-side component provides the user interface and logic for signing up a new user.
   * It utilizes Supabase's `signUp` method for user registration and `next/navigation`'s `useRouter`
   * to redirect newly registered users to the home page or display registration errors.
   * As a client component, it manages form input and error states using React's `useState` hook.
   *
   * @returns A React functional component that renders the signup form.
   *
   * @connections
   * - **`@/lib/supabase`**: Imports the Supabase client to interact with the authentication service.
   * - **`next/navigation`**: Uses `useRouter` for programmatic navigation after successful signup.
   * - **`@/components/ui/card`**: Utilizes `shadcn/ui` Card components for consistent UI presentation.
   * - **`@/components/ui/label`**, **`@/components/ui/input`**, **`@/components/ui/button`**: `shadcn/ui` components for form elements.
   * - **`/auth/login`**: Provides a link to the login page for existing users.
   */
  const [email, setEmail] = useState('') // State to store the user's email input for registration.
  const [password, setPassword] = useState('') // State to store the user's password input for registration.
  const [error, setError] = useState<string | null>(null) // State to store any registration error messages.
  const router = useRouter() // Next.js router hook for navigation.

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent default form submission behavior.
    setError(null) // Clear any previous errors.

    // Attempt to register the new user with provided email and password using Supabase.
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message) // If an error occurs, set the error state to display to the user.
    } else {
      router.push('/') // On successful registration, redirect the user to the home page.
    }
  }

  return (
    // Centering container for the signup card.
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Signup Card component from shadcn/ui. */}
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">Enter your email below to create your account.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Signup form */}
          <form onSubmit={handleSignUp} className="grid gap-4">
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
            {/* Sign Up button */}
            <Button type="submit" className="w-full">Sign Up</Button>
          </form>
        </CardContent>
        {/* Link to login page */}
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline">
            Login
          </Link>
        </div>
      </Card>
    </div>
  )
}
