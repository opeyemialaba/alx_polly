# Polling App with QR Code Sharing

## Project Overview
This is a full-stack web application that allows users to register, create polls, share them via unique links and QR codes, and vote on existing polls. The application emphasizes modern web development practices, leveraging Next.js Server Components and Server Actions for efficient data handling and a seamless user experience.

## Technology Stack

-   **Language**: TypeScript
-   **Main Framework**: Next.js (App Router)
-   **Database & Auth**: Supabase (PostgreSQL, Authentication)
-   **Styling**: Tailwind CSS with shadcn/ui components
-   **State Management**: Primarily Server Components for server state; `useState` or `useReducer` for local client component state.
-   **API Communication**: Next.js Server Actions for mutations (creating polls, voting); Supabase client for data fetching in Server Components.
-   **Utility Libraries**: `qrcode.react` (planned for QR code generation).

## Features

-   User registration and authentication (via Supabase)
-   Create new polls with a question and multiple options
-   View a list of all polls
-   View individual poll details
-   Vote on poll options
-   Share polls via unique links and QR codes (QR code generation planned)

## Setup Steps

To get this project up and running locally, follow these steps:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd alx_polly
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Supabase Configuration

This project uses [Supabase](https://supabase.com/) for its database and authentication services.

a.  **Create a Supabase Project**: Go to [Supabase](https://app.supabase.com/) and create a new project.

b.  **Get Supabase Credentials**: Navigate to your project settings in Supabase to find your:
    -   `Project URL`
    -   `Anon Key` (also known as `Public API Key`)
    -   `Service Role Key` (also known as `Secret API Key`)

c.  **Set up Database Schema**: Use the `supabase/schema.sql` file to set up your database tables.
    In your Supabase project dashboard, go to `SQL Editor` and run the script:

    ```sql
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE polls (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        question TEXT NOT NULL,
        options TEXT[] NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
    );

    CREATE TABLE votes (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
        option_index INT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
    );
    ```

d.  **Configure Row Level Security (RLS)**:
    Enable RLS for `polls` and `votes` tables and create policies. This is crucial for security.

    For `polls` table:
    -   **Policy for viewing all polls (SELECT)**:
        `CREATE POLICY "Enable read access for all users" ON "public"."polls" FOR SELECT USING (true);`
    -   **Policy for creating polls (INSERT)**:
        `CREATE POLICY "Enable insert for authenticated users only" ON "public"."polls" FOR INSERT WITH CHECK (auth.role() = 'authenticated');`
    -   **Policy for updating/deleting own polls (UPDATE/DELETE)**:
        `CREATE POLICY "Enable update/delete for users based on user_id" ON "public"."polls" FOR ALL USING (auth.uid() = user_id);`

    For `votes` table:
    -   **Policy for inserting votes (INSERT)**:
        `CREATE POLICY "Enable insert for authenticated users only on votes" ON "public"."votes" FOR INSERT WITH CHECK (auth.role() = 'authenticated');`
    -   **Policy for viewing votes (SELECT)**:
        `CREATE POLICY "Enable read access for all users on votes" ON "public"."votes" FOR SELECT USING (true);`

### 4. Environment Variables

Create a `.env.local` file in the root of your project and add the following:

```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SECRET_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

Replace `YOUR_SUPABASE_PROJECT_URL`, `YOUR_SUPABASE_ANON_KEY`, and `YOUR_SUPABASE_SERVICE_ROLE_KEY` with the credentials obtained from your Supabase project.

**Note**: `SUPABASE_SECRET_KEY` is used for Server Actions and should not be exposed client-side.

## Usage Examples

### Running the Application

To run the application locally in development mode:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Creating Polls

1.  **Register/Login**: Navigate to `/auth/signup` to create an account or `/auth/login` to log in.
2.  **Create Poll**: Once logged in, navigate to `/create-poll`.
3.  **Enter Details**: Provide a poll question and options (one per line).
4.  **Submit**: Click "Create Poll". You will be redirected to the new poll's detail page.

### Voting on Polls

1.  **View Polls**: Navigate to `/polls` to see a list of all available polls.
2.  **Select Poll**: Click on a poll's title to view its details.
3.  **Choose Option**: Select one of the available options using the radio buttons.
4.  **Vote**: Click the "Vote" button to submit your vote.

### Testing

Currently, the project does not include a dedicated testing suite. Manual testing can be performed by:

-   Navigating through the application in your browser.
-   Creating new users, logging in/out.
-   Creating polls and observing their appearance on the polls list and detail pages.
-   Voting on polls to see the (currently simulated) vote confirmation.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
