/**
 * useSIWE — React hook for Sign-In with Ethereum (EIP-4361) authentication.
 *
 * Orchestrates the full SIWE flow:
 *   1. Fetch a nonce from the backend.
 *   2. Build a SIWE message bound to the current domain / chain.
 *   3. Request the user's wallet to sign the message.
 *   4. Send the signed message to the backend for verification.
 *   5. Store the JWT token in the auth store and load the user profile.
 *
 * Usage:
 * ```tsx
 * const { signIn, signOut, isAuthenticated, isSigningIn, signInError } = useSIWE();
 *
 * <button onClick={() => signIn(address, chainId)}>Sign In</button>
 * ```
 */

'use client';

import { useCallback } from 'react';
import { useSignMessage } from 'wagmi';
import { useTranslation } from 'react-i18next';
import { createSiweMessage } from '@/lib/siwe/createSiweMessage';
import { createAuthApi } from '@/lib/services/authApi';
import { useAuthStore } from '@/lib/store/authStore';

const authApi = createAuthApi();

export function useSIWE() {
  const { signMessageAsync } = useSignMessage();
  const { t } = useTranslation();

  const {
    isAuthenticated,
    isSigningIn,
    signInError,
    setJwt,
    setSigningIn,
    setSignInError,
    setProfile,
    clearAuth,
  } = useAuthStore();

  const signIn = useCallback(
    async (address: `0x${string}`, chainId: number) => {
      setSigningIn(true);
      setSignInError(null);

      try {
        // Step 1: Fetch a nonce from the backend (or generate locally).
        const nonce = await authApi.getNonce();

        // Step 2: Build the SIWE message.
        const siweMessage = createSiweMessage({
          address,
          chainId,
          nonce,
          statement: t('siwe.statement', 'Sign in with Ethereum to WhiteChain to sync your preferences across devices.'),
          // Expire the message in 5 minutes.
          expirationTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        });

        const message = siweMessage.prepareMessage();

        // Step 3: Request the wallet to sign the message.
        const signature = await signMessageAsync({ message });

        // Step 4: Send the signed message to the backend for verification.
        const result = await authApi.verify(message, signature, address);

        // Step 5: Store the JWT and load the profile.
        setJwt(result.jwt);

        if (result.profile) {
          setProfile(result.profile);
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message.includes('User rejected')
              ? t('siwe.rejected', 'Sign-in was rejected.')
              : err.message
            : t('siwe.error', 'An unexpected error occurred during sign-in.');
        setSignInError(message);
      } finally {
        setSigningIn(false);
      }
    },
    [signMessageAsync, t, setJwt, setSigningIn, setSignInError, setProfile]
  );

  const signOut = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  return {
    isAuthenticated,
    isSigningIn,
    signInError,
    signIn,
    signOut,
  };
}