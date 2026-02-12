import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:8000",
  // Note: The client doesn't need secret or database config - that's for the server side
});

// Export signIn and signOut functions with error handling
export const signIn = authClient.signIn;
export const signOut = authClient.signOut;

// Enhanced session getter with error handling
export const getSessionWithFallback = async () => {
  try {
    const session = await authClient.getSession();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};