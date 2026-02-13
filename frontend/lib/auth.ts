import { createAuthClient } from "better-auth/client";

// Determine the base URL based on the environment
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use the current origin or fallback to environment variable
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || window.location.origin.replace(/\/$/, '');
  }

  // Server-side: use environment variable or default to localhost
  return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:8000";
};

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
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