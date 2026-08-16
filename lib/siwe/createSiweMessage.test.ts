import { describe, it, expect } from 'vitest';
import { createSiweMessage, generateLocalNonce } from './createSiweMessage';

describe('createSiweMessage', () => {
  it('creates a SIWE message with the correct domain and address', () => {
    const message = createSiweMessage({
      address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      chainId: 1,
      nonce: 'abcdef1234567890',
      uri: 'https://whitechain.app',
    });

    expect(message).toBeDefined();
    expect(message.domain).toBe('whitechain.app');
    expect(message.address).toBe('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    expect(message.chainId).toBe(1);
    expect(message.nonce).toBe('abcdef1234567890');
    expect(message.version).toBe('1');
    expect(message.scheme).toBe('https');
  });

  it('includes a custom statement when provided', () => {
    const message = createSiweMessage({
      address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      chainId: 1,
      nonce: 'testnonce1234',
      statement: 'Custom statement for testing.',
    });

    expect(message.statement).toBe('Custom statement for testing.');
  });

  it('generates a prepared message string', () => {
    const message = createSiweMessage({
      address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      chainId: 1,
      nonce: 'abcdef1234567890',
      uri: 'https://whitechain.app',
    });

    const prepared = message.prepareMessage();
    expect(prepared).toContain('whitechain.app');
    expect(prepared).toContain('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    expect(prepared).toContain('Chain ID: 1');
    expect(prepared).toContain('Nonce: abcdef1234567890');
  });
});

describe('generateLocalNonce', () => {
  it('generates a nonce of at least 8 characters', () => {
    const nonce = generateLocalNonce();
    expect(nonce.length).toBeGreaterThanOrEqual(8);
  });

  it('generates unique values on successive calls', () => {
    const nonce1 = generateLocalNonce();
    const nonce2 = generateLocalNonce();
    expect(nonce1).not.toBe(nonce2);
  });

  it('contains only hex characters', () => {
    const nonce = generateLocalNonce();
    expect(/^[0-9a-f]+$/.test(nonce)).toBe(true);
  });
});