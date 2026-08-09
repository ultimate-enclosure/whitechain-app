'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, X } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import MobileNav from './MobileNav';

import { useIsMounted } from '@/lib/useIsMounted';
import { ThemeToggle } from './ThemeToggle';
import { SlippageSettings } from './SlippageSettings';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CurrencySelector } from './CurrencySelector';

export function Navbar() {
  const { t } = useTranslation();
  const isMounted = useIsMounted();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Focus management for the mobile navigation dialog (WCAG 2.4.3 Focus Order):
  // move focus into the menu when it opens and return it to the trigger on close.
  useEffect(() => {
    if (isMobileMenuOpen) {
      const dialog = document.getElementById('mobile-navigation');
      if (dialog) {
        const focusable = dialog.querySelector<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      }
    } else {
      hamburgerRef.current?.focus();
    }
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
     <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          WhiteChain
        </span>

        {/* Desktop Wallet Actions */}
        <div className="hidden md:flex items-center gap-3">
          <SlippageSettings />
          <LanguageSwitcher />
          <CurrencySelector />
          <ThemeToggle />
          {isMounted && (
            <ConnectButton
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full'
              }}
              chainStatus={{ smallScreen: 'icon', largeScreen: 'full' }}
              showBalance={{ smallScreen: false, largeScreen: true }}
            />
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          ref={hamburgerRef}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={
            isMobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')
          }
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          className="rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 md:hidden"
        >
          {isMobileMenuOpen ? (
            <X size={24} aria-hidden="true" />
          ) : (
            <Menu size={24} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {/* {isMobileMenuOpen && ( */}
        <MobileNav
          onClose={closeMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />
      {/* )} */}
    </header>
  );
}