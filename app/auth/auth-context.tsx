
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  /**
   * @property user - The currently authenticated Supabase user object, or `null` if not authenticated.
   */
  user: User | null
  /**
   * @property loading - A boolean indicating whether the authentication state is currently being loaded.
   *   `true` during initial load or while waiting for authentication state changes; `false` otherwise.
   */
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  /**
   * @summary Provides authentication context to its children components.
   *
   * @description This `AuthProvider` component is a client-side React component that manages and provides
   * the current authentication status of the user throughout the application. It initializes
   * the Supabase client and listens for authentication state changes (`onAuthStateChange`).
   * It makes the `user` object and `loading` state available to any component that consumes
   * the `AuthContext` via the `useAuth` hook. This ensures that UI components can react to
   * login/logout events and display appropriate content.
   *
   * @param children - React nodes to be rendered within the provider's scope, allowing them
   *   to access the authentication context.
   *
   * @returns A React functional component that wraps its children with the `AuthContext.Provider`,
   *   passing down the current user and loading status.
   *
   * @connections
   * - **`@/lib/supabase`**: Imports the Supabase client to manage authentication sessions.
   * - **`AuthContextType`**: Defines the shape of the context value.
   * - **`useAuth`**: The hook used by child components to consume this context.
   * - **Supabase `onAuthStateChange`**: Subscribes to authentication events to keep the `user` state updated.
   *
   * @assumptions
   * - The Supabase client in `@/lib/supabase` is correctly initialized.
   * - The application relies on Supabase for all user authentication.
   */
  const [user, setUser] = useState<User | null>(null) // State to hold the authenticated user object from Supabase.
  const [loading, setLoading] = useState(true) // State to indicate if the authentication status is still being determined.

  useEffect(() => {
    // Subscribe to Supabase authentication state changes.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null) // Update user state based on the new session.
      setLoading(false) // Mark loading as false once the initial state is determined or changes occur.
    })

    // Get the initial session immediately when the component mounts.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null) // Set the user from the initial session.
      setLoading(false) // Mark loading as false.
    })

    // Cleanup function: Unsubscribe from auth state changes when the component unmounts.
    return () => {
      subscription.unsubscribe()
    }
  }, []) // Empty dependency array ensures this effect runs only once on mount and unmount.

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  /**
   * @summary A custom hook to access the authentication context.
   *
   * @description This hook provides a convenient way for any descendant component of `AuthProvider`
   * to access the current `user` and `loading` status from the authentication context.
   * It ensures that the hook is used within an `AuthProvider` by throwing an error if the context
   * is `undefined`.
   *
   * @returns The `AuthContextType` object containing the `user` and `loading` states.
   *
   * @throws {Error} If `useAuth` is called outside of an `AuthProvider`'s scope.
   *
   * @example
   * ```typescript
   * // In a child component:
   * const { user, loading } = useAuth();
   * if (loading) return <LoadingSpinner />;
   * if (!user) return <SignInMessage />;
   * return <UserProfile user={user} />;
   * ```
   */
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
