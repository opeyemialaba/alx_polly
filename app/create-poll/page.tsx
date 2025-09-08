'use client'

import { CreatePollForm } from '@/components/CreatePollForm';

export default function CreatePollPage() {
  /**
   * @summary Page for creating new polls.
   *
   * @description This client-side page component is responsible for rendering the `CreatePollForm`.
   * It provides the user interface for inputting a new poll question and its options.
   * As a client component, it leverages the interactivity provided by `CreatePollForm`
   * for state management and form submission handled by a Server Action.
   *
   * @returns A React functional component that renders the poll creation form within a centered layout.
   *
   * @connections
   * - **`@/components/CreatePollForm`**: Imports and renders the form component where the actual poll creation logic resides.
   * - **Server Actions**: The `CreatePollForm` component internally calls a Server Action (`createPoll`)
   *   to handle the persistent storage of the new poll.
   */
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <CreatePollForm /> {/* Renders the form component responsible for creating new polls. */}
    </div>
  );
}

