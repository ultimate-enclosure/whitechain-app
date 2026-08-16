/**
 * createSiweMessage — EIP-4361 Sign-In with Ethereum message factory.
 *
 * Builds a standard SIWE message object that the user's wallet signs.
 * The message is domain-bound to prevent replay attacks across dApps.
 */

import { SiweMessage } from 'siwe';

/**
 * Options for creating a SIWE message.
 */
export interface CreateSiweMessageOptions {
  /** Ethereum address performing the signing. */
  address: `0x${string}`;
  /** EIP-155 Chain ID (e.g. 1 for Ethereum mainnet). */
  chainId: number;
  /** Randomized token obtained from the backend /auth/nonce. */
  nonce: string;
  /** RFC 3986 URI of the dApp (defaults to window.location.origin). */
  uri?: string;
  /** Optional human-readable statement shown in the wallet prompt. */
  statement?: string;
  /** Optional ISO 8601 expiration time (e.g. in 5 minutes). */
  expirationTime?: string;
  /** Optional list of URIs the user wishes to have resolved. */
  resources?: string[];
}

/**
 * Create a SIWE message ready for signing.
 *
 * If no `uri` is provided, it defaults to the current window origin.
 * The `domain` is always derived from the `uri` (or window location).
 */
export function createSiweMessage({
  address,
  chainId,
  nonce,
  uri,
  statement,
  expirationTime,
  resources,
}: CreateSiweMessageOptions): SiweMessage {
  const origin = uri ?? (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  const domain = new URL(origin).hostname;

  const message = new SiweMessage({
    scheme: 'https',
    domain,
    address,
    statement: statement ?? 'Sign in to sync your WhiteChain preferences across devices.',
    uri: origin,
    version: '1',
    chainId,
    nonce,
    issuedAt: new Date().toISOString(),
    ...(expirationTime ? { expirationTime } : {}),
    ...(resources && resources.length > 0 ? { resources } : {}),
  });

  return message;
}

/**
 * Generate a simple random nonce for cases where the backend nonce endpoint
 * is not available.  For production use, always fetch a nonce from the
 * backend to prevent replay attacks.
 */
export function generateLocalNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32);
}