/**
 * @fileoverview Supabase Client Configuration
 *
 * @description This file initializes and exports a Supabase client instance.
 * It is crucial for all interactions with the Supabase backend, including
 * authentication, database queries, and real-time subscriptions.
 * The client is configured with environment variables to ensure secure and
 * environment-specific access to the Supabase project.
 *
 * @returns The initialized Supabase client instance.
 *
 * @connections
 * - **`.env.local`**: Reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
 *   from environment variables for configuration.
 * - **All components/actions interacting with Supabase**: Imported by `lib/actions.ts`,
 *   `app/auth/auth-context.tsx`, `app/auth/login/page.tsx`, `app/auth/signup/page.tsx`,
 *   and potentially other files requiring database or authentication access.
 *
 * @assumptions
 * - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables
 *   are correctly set in the `.env.local` file.
 * - The Supabase project is properly configured and accessible.
 */

import { createClient } from '@supabase/supabase-js'

// Retrieve Supabase URL and Anon Key from environment variables.
// These are public keys safe to be exposed to the browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * @summary The initialized Supabase client instance.
 *
 * @description This `supabase` object is the main entry point for interacting with
 * the Supabase services (Auth, Database, Storage, etc.). It is created using
 * `createClient` with the provided Supabase URL and anonymous key.
 * The `!` non-null assertion operator is used here, assuming that the environment
 * variables are always provided in the deployment environment.
 *
 * @remarks
 * Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are defined
 * in your `.env.local` file (or deployment environment).
 *
 * @see https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 */
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!)
