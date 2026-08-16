/**
 * ProfileSettings — authenticated user profile settings panel.
 *
 * Shown once the user has signed in via SIWE.  Displays the connected
 * wallet address and a button to sign out.  When the backend returns a
 * profile (e.g. persisted theme / slippage preferences), it is surfaced
 * here and can be synced back.
 */

'use client';

import { useAccount, useChainId } from 'wagmi';
import { useTranslation } from 'react-i18next';
import { useSIWE } from '@/lib/hooks/useSIWE';
import { useAuthStore } from '@/lib/store/authStore';

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function ProfileSettings() {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { isAuthenticated, isSigningIn, signInError, signIn, signOut } = useSIWE();
  const profile = useAuthStore((s) => s.profile);
  const chainId = useChainId();

  if (isAuthenticated) {
    return (
      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {t('siwe.signedIn', 'Signed in')}
        </h3>
        {address && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {shortenAddress(address)}
          </p>
        )}

        {profile && (
          <dl className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-300">
            {profile.theme && (
              <div className="flex justify-between">
                <dt>{t('siwe.theme', 'Theme')}</dt>
                <dd className="font-medium">{profile.theme}</dd>
              </div>
            )}
            {profile.displayCurrency && (
              <div className="flex justify-between">
                <dt>{t('siwe.currency', 'Currency')}</dt>
                <dd className="font-medium">{profile.displayCurrency}</dd>
              </div>
            )}
            {profile.language && (
              <div className="flex justify-between">
                <dt>{t('siwe.language', 'Language')}</dt>
                <dd className="font-medium">{profile.language}</dd>
              </div>
            )}
          </dl>
        )}

        <button
          type="button"
          onClick={signOut}
          className="btn-outline mt-4 w-full"
        >
          {t('common.disconnect', 'Disconnect')}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {t('siwe.signInTitle', 'Sign in to sync preferences')}
      </h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
        {t(
          'siwe.signInDesc',
          'Sign in with your wallet to persist your theme, slippage, and other settings across devices.'
        )}
      </p>

      {address && (
        <button
          type="button"
          disabled={isSigningIn}
          onClick={() => signIn(address, chainId)}
          className="btn mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSigningIn
            ? t('siwe.signingIn', 'Signing in…')
            : t('siwe.signInButton', 'Sign in with Ethereum')}
        </button>
      )}

      {signInError && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {signInError}
        </p>
      )}
    </div>
  );
}

export default ProfileSettings;