/**
 * authApi — thin client for the WhiteChain SIWE backend endpoints.
 *
 * The dApp expects the following backend routes (base URL from
 * NEXT_PUBLIC_API_URL):
 *   GET  /auth/nonce   -> { nonce: string }
 *   POST /auth/verify  -> { jwt: string, profile: UserProfile }
 *
 * When NEXT_PUBLIC_API_URL is not set, the client falls back to a
 * local-only mode that mints a session token from the signed message
 * without a remote backend (useful for development / demonstration).
 */

import type { UserProfile } from '@/lib/store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export interface NonceResponse {
  nonce: string;
}

export interface VerifyResponse {
  jwt: string;
  profile?: UserProfile;
}

export interface AuthApi {
  /** Fetch a fresh nonce from the backend. */
  getNonce: () => Promise<string>;
  /** Verify a signed SIWE message and receive a JWT session token. */
  verify: (message: string, signature: string, address: string) => Promise<VerifyResponse>;
}

/**
 * Create the auth API client.  When `NEXT_PUBLIC_API_URL` is unset, returns
 * a local-only implementation that generates a nonce locally and "verifies"
 * by constructing a session token, so the SIWE flow works end-to-end even
 * without a deployed backend.
 */
export function createAuthApi(): AuthApi {
  if (!API_BASE_URL) {
    return createLocalAuthApi();
  }
  return createRemoteAuthApi(API_BASE_URL);
}

function createRemoteAuthApi(baseUrl: string): AuthApi {
  return {
    async getNonce() {
      const res = await fetch(`${baseUrl}/auth/nonce`, { method: 'GET' });
      if (!res.ok) {
        throw new Error(`Failed to fetch nonce: ${res.status}`);
      }
      const data = (await res.json()) as NonceResponse;
      return data.nonce;
    },

    async verify(message, signature, address) {
      const res = await fetch(`${baseUrl}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature, address }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Authentication failed (${res.status}): ${text.slice(0, 200)}`);
      }
      return (await res.json()) as VerifyResponse;
    },
  };
}

function createLocalAuthApi(): AuthApi {
  return {
    async getNonce() {
      // 32 hex chars, 8+ alphanumeric — satisfies SIWE nonce constraints.
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    },

    async verify(message, signature, address) {
      // Local-only mode: no real backend verification.  Mint a session token
      // derived from the message + signature so the flow completes.
      const payload = btoa(
        JSON.stringify({ address, signedAt: new Date().toISOString() })
      );
      const jwt = `local.${payload}.demo`;
      return { jwt };
    },
  };
}