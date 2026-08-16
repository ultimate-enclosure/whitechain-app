/**
 * Auth Store — Zustand store for SIWE authentication state.
 *
 * Manages the JWT session token and user profile data obtained after
 * successful SIWE-based authentication.  The token is persisted in
 * memory (not localStorage) for security — on page reload the user
 * must re-authenticate via the cached session (if the backend supports
 * cookie-based sessions) or re-sign.
 */

'use client';

import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthState {
  /** JWT token obtained from the backend after SIWE verification. */
  jwt: string | null;
  /** Whether the user is currently authenticated. */
  isAuthenticated: boolean;
  /** Wallet address that is authenticated. */
  authenticatedAddress: `0x${string}` | null;
  /** Whether a sign-in request is in progress. */
  isSigningIn: boolean;
  /** Error message from the last failed sign-in attempt. */
  signInError: string | null;
  /** User profile data fetched from the backend. */
  profile: UserProfile | null;
}

export interface UserProfile {
  theme?: 'light' | 'dark';
  slippageTolerance?: number;
  displayCurrency?: string;
  language?: string;
  preferences?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export interface AuthActions {
  /** Set the JWT token after successful authentication. */
  setJwt: (jwt: string) => void;
  /** Set signing-in state. */
  setSigningIn: (value: boolean) => void;
  /** Set sign-in error. */
  setSignInError: (error: string | null) => void;
  /** Load user profile from backend. */
  setProfile: (profile: UserProfile) => void;
  /** Clear authentication state (sign out). */
  clearAuth: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  jwt: null,
  isAuthenticated: false,
  authenticatedAddress: null,
  isSigningIn: false,
  signInError: null,
  profile: null,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,

  setJwt: (jwt: string) =>
    set({ jwt, isAuthenticated: true, signInError: null }),

  setSigningIn: (isSigningIn: boolean) => set({ isSigningIn }),

  setSignInError: (signInError: string | null) => set({ signInError }),

  setProfile: (profile: UserProfile) => set({ profile }),

  clearAuth: () => set({ ...initialState }),
}));