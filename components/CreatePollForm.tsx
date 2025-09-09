'use client';

import { useState } from 'react';
import { createPoll } from '@/lib/actions'; // Import the Server Action
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function CreatePollForm() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    
    const result = await createPoll(formData); // Call the Server Action directly

    if (result?.error) {
      setError(result.error); // Set error if the Server Action returns an error
    } 
    // Redirection is handled by the createPoll Server Action on success, so no else block needed here.

    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create a New Poll</CardTitle>
        <CardDescription>Enter your poll question and options.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Poll Question</Label>
            <Input
              id="question"
              name="question"
              placeholder="e.g., What's your favorite color?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="options">Options (one per line)</Label>
            <Textarea
              id="options"
              name="options"
              placeholder="Blue\nRed\nGreen"
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              required
              rows={4}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Poll'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
