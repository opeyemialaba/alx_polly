'use server';

import { createClient } from './supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPoll(formData: FormData) {
  /**
   * @summary Creates a new poll in the database.
   *
   * @description This Server Action is responsible for handling the submission of a new poll.
   * It is used by the `CreatePollForm` client component to safely and securely create
   * a new poll entry in the Supabase database. This approach ensures that database
   * operations are performed on the server, enhancing security and allowing for
   * features like `revalidatePath` and `redirect` which are only available in Server Components.
   *
   * @param formData - A `FormData` object containing the poll question and options.
   *   Expected fields:
   *   - `question`: The main question for the poll (string).
   *   - `options`: A string where each line represents a poll option (string).
   *
   * @returns A promise that resolves to an object with an `error` property if an error occurs,
   *   otherwise it redirects the user to the newly created poll's page.
   *
   * @throws {Error} If the user is not authenticated, they are redirected to the login page.
   *
   * @precondition The user must be authenticated. If not, they will be redirected to `/auth/login`.
   * @postcondition A new poll entry is created in the `polls` table in Supabase.
   *   The home page (`/`) is revalidated to reflect the new poll.
   *   The user is redirected to the newly created poll's detail page (`/poll/[id]`).
   *
   * @example
   * ```typescript
   * // In a Client Component (e.g., CreatePollForm.tsx)
   * const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
   *   event.preventDefault();
   *   const formData = new FormData(event.currentTarget);
   *   const result = await createPoll(formData);
   *   if (result?.error) {
   *     // Handle error on the client
   *   }
   * };
   * ```
   *
   * @assumptions
   * - The `createClient` utility correctly initializes the Supabase client.
   * - The `polls` table exists in Supabase with `question`, `options` (array type),
   *   and `user_id` columns.
   * - Environment variables for Supabase URL and key are correctly set.
   *
   * @edgeCases
   * - **Unauthenticated User**: Redirected to login page.
   * - **Missing Question or Less than Two Options**: Returns an error message to the client.
   * - **Database Error**: Logs the error and returns an error message to the client.
   *
   * @connections
   * - **`CreatePollForm.tsx`**: This function is called by the `CreatePollForm` component
   *   to handle the form submission for creating a new poll. It relies on the form
   *   data being correctly formatted.
   * - **Supabase**: Interacts directly with the Supabase database to insert poll data.
   * - **Next.js Caching (`revalidatePath`)**: Invalidates the cache for the home page
   *   to ensure new polls are immediately visible.
   * - **Next.js Navigation (`redirect`)**: Navigates the user to the newly created
   *   poll's page upon successful creation.
   */
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const question = formData.get('question') as string;
  const optionsString = formData.get('options') as string;
  const options = optionsString.split('\n').map(option => option.trim()).filter(option => option.length > 0);

  if (!question || options.length < 2) {
    return { error: 'Please provide a question and at least two options.' };
  }

  const { data, error } = await supabase
    .from('polls')
    .insert({ question, options, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error('Error creating poll:', error);
    return { error: error.message };
  }

  revalidatePath('/'); // Revalidate the home page to show new poll
  redirect(`/poll/${data.id}`); // Redirect to the new poll page
}

export async function voteOnPoll(formData: FormData) {
  /**
   * @summary Records a user's vote for a specific poll option.
   *
   * @description This Server Action handles the submission of a user's vote.
   * It receives the `pollId` and `optionIndex` from the client-side form submission.
   * It first authenticates the user, then records the vote in the `votes` table in Supabase.
   * After a successful vote, it revalidates the cache for the specific poll page to ensure
   * that updated vote counts are immediately visible to users.
   *
   * @param formData - A `FormData` object containing the poll ID and the index of the selected option.
   *   Expected fields:
   *   - `pollId`: The unique identifier of the poll being voted on (string).
   *   - `optionIndex`: The zero-based index of the option that the user selected (string, will be parsed to number).
   *
   * @returns A promise that resolves to an object with an `error` property if an error occurs.
   *   On successful vote, it performs a `revalidatePath` and does not return anything explicit.
   *
   * @throws {Error} If the user is not authenticated, they are redirected to the login page.
   *
   * @precondition The user must be authenticated. If not, they will be redirected to `/auth/login`.
   * @postcondition A new vote entry is created in the `votes` table in Supabase.
   *   The specific poll's page (`/polls/[id]`) is revalidated to reflect the updated vote counts.
   *
   * @example
   * ```typescript
   * // In a Client Component (e.g., SinglePollPage.tsx)
   * const handleVote = async (event: React.FormEvent<HTMLFormElement>) => {
   *   event.preventDefault();
   *   const formData = new FormData(event.currentTarget);
   *   formData.append('pollId', poll.id);
   *   formData.append('optionIndex', selectedOptionIndex.toString());
   *   const result = await voteOnPoll(formData);
   *   if (result?.error) {
   *     // Handle error on the client
   *   }
   * };
   * ```
   *
   * @assumptions
   * - The `createClient` utility correctly initializes the Supabase client.
   * - The `votes` table exists in Supabase with `poll_id`, `option_index`, and `user_id` columns.
   * - The `polls` table is correctly referenced by `poll_id` in the `votes` table.
   * - Environment variables for Supabase URL and key are correctly set.
   *
   * @edgeCases
   * - **Unauthenticated User**: Redirected to login page.
   * - **Missing `pollId` or `optionIndex`**: Returns an error message.
   * - **Invalid `optionIndex`**: If `optionIndex` does not correspond to a valid option for the poll, a database error might occur (handled by Supabase constraints or application logic).
   * - **Database Error**: Logs the error and returns an error message to the client.
   *
   * @connections
   * - **`app/polls/[id]/page.tsx`**: This function is called by the `SinglePollPage` component
   *   to handle the vote submission for a specific poll.
   * - **Supabase**: Interacts directly with the Supabase database to insert vote data.
   * - **Next.js Caching (`revalidatePath`)**: Invalidates the cache for the specific poll page
   *   to ensure vote counts are up-to-date.
   * - **Next.js Navigation (`redirect`)**: Handles redirection if the user is not authenticated.
   */
  const supabase = createClient(); // Initialize Supabase client.

  const { data: { user } } = await supabase.auth.getUser(); // Get the current authenticated user.

  if (!user) {
    redirect('/auth/login'); // Redirect to login if user is not authenticated.
  }

  const pollId = formData.get('pollId') as string; // Extract pollId from form data.
  const optionIndex = parseInt(formData.get('optionIndex') as string, 10); // Extract and parse optionIndex.

  // Validate input parameters.
  if (!pollId || isNaN(optionIndex)) {
    return { error: 'Invalid poll or option selected.' };
  }

  // Insert the vote into the 'votes' table.
  const { error } = await supabase
    .from('votes')
    .insert({ poll_id: pollId, option_index: optionIndex, user_id: user.id });

  if (error) {
    console.error('Error recording vote:', error); // Log any database errors.
    return { error: error.message };
  }

  revalidatePath(`/polls/${pollId}`); // Revalidate the specific poll page to show updated results.
}
