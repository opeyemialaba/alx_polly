/**
 * Jest setup file to mock Next.js modules and Supabase client.
 */

// Mock 'next/cache' to prevent errors when testing Server Actions.
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

// Mock 'next/navigation' to prevent errors from `redirect` in Server Actions.
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

// Mock the Supabase client used in './supabase'.
// This is a manual mock to control Supabase behavior during tests.
const mockAuth = {
  getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'test-user-id', email: 'test@example.com' } }, error: null })),
  signInWithPassword: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
  signUp: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
  signOut: jest.fn(() => Promise.resolve({ error: null })),
};

const mockFrom = jest.fn(() => ({
  insert: jest.fn(() => ({
    select: jest.fn(() => ({
      single: jest.fn(() => Promise.resolve({ data: { id: 'new-poll-id' }, error: null })),
    })),
  })),
  // For votes, we just need to confirm insertion, no select or single is typically expected
  // For simplicity, we'll mock insert to return a successful promise directly.
  insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
}));

jest.mock('./lib/supabase', () => ({
  createClient: jest.fn(() => ({
    auth: mockAuth,
    from: mockFrom,
  })),
}));
