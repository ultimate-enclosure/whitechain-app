"use client";

import { X } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import BalanceDisplay from "./BalanceDisplay";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from 'react-i18next';

const NAV_LINKS = [
  { href: '/', key: 'nav.home' },
  { href: '/marketplace', key: 'nav.marketplace' },
  { href: '/about', key: 'nav.about' },
];

export default function MobileNav({
  isMobileMenuOpen,
  onClose,
}: {
  isMobileMenuOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div
      id="mobile-navigation"
      role="dialog"
      aria-modal={isMobileMenuOpen}
      aria-label={t('nav.mobileNav')}
      aria-hidden={!isMobileMenuOpen}
      inert={!isMobileMenuOpen ? '' : undefined}
      className={`fixed left-0 top-0 z-50 h-screen w-full overflow-y-auto bg-white transition-all duration-300 ease-in-out dark:bg-gray-950 md:hidden ${
        isMobileMenuOpen
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        {/* Close Button */}
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
                        aria-label={t('nav.closeMenu')}
            className="rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav aria-label={t('nav.mobileNav')}>
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={onClose}
                  className="block rounded-md px-3 py-3 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                >
                  {t(link.key)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Wallet Actions */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">{t('common.theme')}</span>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
        <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-800">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted
            }) => {
              const connected = mounted && account && chain;
              return (
                <div
                  {...(!mounted && {
                    'aria-hidden': true,
                    style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' }
                  })}
                >
                  {connected ? (
                    <div className="flex flex-col gap-3">
                      <BalanceDisplay />
                      <button
                        type="button"
                        onClick={openAccountModal}
                        className="btn-outline w-full"
                      >
                        {t('common.disconnect')} {`${account.displayName}`}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        openConnectModal();
                        onClose();
                      }}
                      className="btn w-full"
                    >
                      {t('common.connectWallet')}
                    </button>
                  )}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </div>
  );
}