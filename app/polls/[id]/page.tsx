'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/auth/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Poll } from '@/lib/types'; // Import the Poll type from lib/types.ts
import { voteOnPoll } from '@/lib/actions'; // Import the Server Action for voting

// Temporarily using dummy data for a single poll.
// In a real application, this data would be fetched from Supabase based on the poll ID.
const dummyPoll: Poll = {
  id: "1",
  question: "What is your favorite programming language?",
  options: [
    "JavaScript",
    "Python",
    "TypeScript",
  ],
  created_by: "user1",
  created_at: new Date().toISOString(),
};

export default function SinglePollPage({ params }: { params: { id: string } }) {
  /**
   * @summary Displays details of a single poll and allows authenticated users to vote.
   *
   * @description This client-side page component is responsible for rendering the details of a specific poll
   * identified by its ID in the URL parameters. It fetches (currently uses dummy data) the poll data,
   * displays the question and options, and allows authenticated users to cast a vote.
   * It utilizes the `useAuth` hook to ensure users are authenticated and redirects them to the login
   * page if they are not. The voting mechanism is currently a placeholder and would interact with
   * a Server Action in a full implementation.
   *
   * @param params - An object containing route parameters, specifically `params.id` for the poll ID.
   *   - `id`: The unique identifier of the poll to be displayed.
   *
   * @returns A React functional component that renders the detailed poll view with voting options.
   *
   * @connections
   * - **`@/app/auth/auth-context`**: Consumes the `AuthContext` via `useAuth` for user authentication status.
   * - **`next/navigation`**: Uses `useRouter` for programmatic redirection.
   * - **`@/components/ui/card`**: `shadcn/ui` card components for structuring the poll display.
   * - **`@/components/ui/button`**: `shadcn/ui` button component for submitting votes.
   * - **`@/components/ui/radio-group`**, **`@/components/ui/label`**: `shadcn/ui` components for poll options.
   * - **`@/lib/types`**: Imports the `Poll` type for consistent data structuring.
   * - **Server Actions (Planned)**: Voting functionality will eventually interact with a Server Action.
   *
   * @assumptions
   * - The `AuthContext` is correctly provided by an `AuthProvider` higher in the component tree.
   * - The `Poll` type in `lib/types.ts` accurately reflects the structure of poll data.
   *
   * @todo Replace `dummyPoll` with actual data fetched from Supabase using the `params.id` in a Server Component.
   * @todo Implement actual voting logic by calling a Server Action to record the vote in Supabase.
   */
  const { user, loading } = useAuth() // Get current user and loading state from authentication context.
  const router = useRouter() // Initialize Next.js router for navigation.
  const [selectedOption, setSelectedOption] = useState<string | null>(null) // State to store the user's selected poll option.
  const [poll, setPoll] = useState<Poll | null>(null) // State to store the poll data fetched from the backend.

  useEffect(() => {
    // Redirect unauthenticated users to the login page.
    if (!loading && !user) {
      router.push('/auth/login')
    }
    // In a real application, this is where you would fetch the poll data based on params.id.
    // For now, we are using the dummy data.
    if (!poll) { // Only set dummy data if poll hasn't been set yet
      setPoll(dummyPoll) 
    }
  }, [user, loading, router, params.id, poll]) // Effect dependencies to re-run when user, loading, router, params.id, or poll changes.

  const handleVote = async () => {
    // Ensure an option is selected before attempting to vote.
    if (selectedOption && poll) {
      // Find the index of the selected option.
      const optionIndex = poll.options.indexOf(selectedOption);
      if (optionIndex === -1) {
        alert('Selected option not found.');
        return;
      }

      const formData = new FormData();
      formData.append('pollId', poll.id);
      formData.append('optionIndex', optionIndex.toString());

      // Call the Server Action to record the vote.
      const result = await voteOnPoll(formData);

      if (result?.error) {
        alert(`Error voting: ${result.error}`); // Display error to the user.
      } else {
        alert(`Voted for: ${selectedOption}`); // Confirm successful vote.
        // In a real app, you might want to optimistically update the UI or re-fetch poll data.
      }
    } else {
      alert('Please select an option to vote.'); // Alert if no option is selected.
    }
  }

  // Display a loading indicator while authentication state or poll data is being determined.
  if (loading || !poll) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  // If no user is authenticated after loading, return null (redirection is handled by useEffect).
  if (!user) {
    return null
  }

  return (
    // Main container for the single poll page.
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Card component to display the poll details. */}
      <Card className="w-full max-w-md">
        <CardHeader>
          {/* Poll question. */}
          <CardTitle className="text-2xl font-bold text-center">{poll.question}</CardTitle>
          <CardDescription className="text-center">Select an option to vote.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* Radio group for poll options. */}
          <RadioGroup onValueChange={setSelectedOption} value={selectedOption || ""}>
            {poll.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option} (0 votes)</Label> {/* Display option text and placeholder for votes. */}
              </div>
            ))}
          </RadioGroup>
          {/* Button to submit the vote. */}
          <Button onClick={handleVote} className="w-full">Vote</Button>
        </CardContent>
        {/* Display poll creation details. */}
        <CardDescription className="text-sm text-muted-foreground text-center mt-4">
          Created by {poll.created_by} on {new Date(poll.created_at).toLocaleDateString()}
        </CardDescription>
      </Card>
    </div>
  )
}

