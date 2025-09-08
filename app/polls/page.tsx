'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/auth/auth-context'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Poll } from '@/lib/types'; // Import the Poll type from lib/types.ts

export default function PollsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }

    async function fetchPolls() {
      const response = await fetch('/api/polls');
      const data = await response.json();
      setPolls(data);
    }

    if (user) {
      fetchPolls();
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Polls</h1>
        <Link href="/create-poll">
          <Button>Create New Poll</Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => (
          <Card key={poll.id} className="bg-card text-card-foreground rounded-lg shadow-md p-6">
            <CardHeader>
              <Link href={`/polls/${poll.id}`}>
                <CardTitle className="text-xl font-semibold mb-2 hover:underline cursor-pointer">
                  {poll.question}
                </CardTitle>
              </Link>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {poll.options.map((option, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{option}</span>
                    <span className="text-muted-foreground text-sm">0 votes</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardDescription className="text-sm text-muted-foreground mt-4">Created: {new Date(poll.created_at).toLocaleDateString()}</CardDescription>
          </Card>
        ))}
      </div>
    </div>
  );
}
