'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/auth/auth-context'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Poll } from '@/lib/types'; // Import the Poll type from lib/types.ts

// Temporarily using dummy data for polls.
// In a real application, this data would be fetched from Supabase in a Server Component.
const dummyPolls: Poll[] = [
  {
    id: "1",
    question: "What is your favorite programming language?",
    options: [
      "JavaScript",
      "Python",
      "TypeScript",
    ],
    created_by: "user1",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    question: "Which framework do you prefer for frontend development?",
    options: [
      "React",
      "Vue",
      "Angular",
    ],
    created_by: "user2",
    created_at: new Date().toISOString(),
  },
];

export default function PollsPage() {
  /**
   * @summary Displays a list of all available polls.
   *
   * @description This client-side page component fetches and presents a list of polls.
   * It ensures that only authenticated users can view the polls by leveraging the `useAuth` hook
   * and redirecting unauthenticated users to the login page. It currently uses dummy data
   * but is designed to eventually fetch real poll data from Supabase. Users can navigate to
   * individual poll pages or to a page for creating new polls.
   *
   * @returns A React functional component that renders a grid of poll cards.
   *
   * @connections
   * - **`@/app/auth/auth-context`**: Consumes the `AuthContext` via `useAuth` for user authentication status.
   * - **`next/navigation`**: Uses `useRouter` for programmatic redirection.
   * - **`next/link`**: Provides client-side navigation to individual poll pages and the create poll page.
   * - **`@/components/ui/button`**: `shadcn/ui` button component for creating new polls.
   * - **`@/components/ui/card`**: `shadcn/ui` card components for displaying each poll summary.
   * - **`@/lib/types`**: Imports the `Poll` type for consistent data structuring.
   *
   * @assumptions
   * - The `AuthContext` is correctly provided by an `AuthProvider` higher in the component tree.
   * - The `Poll` type in `lib/types.ts` accurately reflects the structure of poll data.
   *
   * @todo Replace `dummyPolls` with actual data fetched from Supabase in a Server Component.
   *   This will involve creating a Server Component to fetch data and passing it down to a client component for display.
   */
  const { user, loading } = useAuth() // Get current user and loading state from authentication context.
  const router = useRouter() // Initialize Next.js router for navigation.

  useEffect(() => {
    // Redirect unauthenticated users to the login page.
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router]) // Effect dependencies to re-run when user, loading, or router changes.

  // Display a loading indicator while authentication state is being determined.
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  // If no user is authenticated after loading, return null (redirection is handled by useEffect).
  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Polls</h1>
        {/* Link to the poll creation page. */}
        <Link href="/create-poll">
          <Button>Create New Poll</Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Map through dummy polls and render a Card for each. */}
        {dummyPolls.map((poll) => (
          <Card key={poll.id} className="bg-card text-card-foreground rounded-lg shadow-md p-6">
            <CardHeader>
              {/* Link to the individual poll detail page. */}
              <Link href={`/polls/${poll.id}`}>
                <CardTitle className="text-xl font-semibold mb-2 hover:underline cursor-pointer">
                  {poll.question}
                </CardTitle>
              </Link>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {/* List poll options and their votes. */}
                {poll.options.map((option, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{option}</span>
                    {/* Note: Dummy data currently does not have votes per option. 
                        This will need to be updated when integrated with real data. */}
                    <span className="text-muted-foreground text-sm">0 votes</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            {/* Display poll creation date. */}
            <CardDescription className="text-sm text-muted-foreground mt-4">Created: {new Date(poll.created_at).toLocaleDateString()}</CardDescription>
          </Card>
        ))}
      </div>
    </div>
  );
}
