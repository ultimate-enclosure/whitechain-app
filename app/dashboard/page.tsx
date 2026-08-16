'use client';

import { Suspense, lazy, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { TransactionHistorySection } from '@/components/TransactionHistorySection';
import { TransactionSimulator } from '@/components/TransactionSimulator';
import { CachedActivity } from '@/components/CachedActivity';
import { SendModal } from '@/components/SendModal';
import { PortfolioAssets } from '@/components/PortfolioAssets';
import { VaultTable } from '@/components/vaults/VaultTable';
import { PluginGrid } from '@/components/dashboard/PluginGrid';
import { SwapCard } from '@/components/swap/SwapCard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ProtocolStatsBar } from '@/components/dashboard/ProtocolStatsBar';
import { RecentSwaps } from '@/components/dashboard/RecentSwaps';
import { SkeletonLoader } from '@/components/SkeletonLoader';

// Lazy-load the chart component so recharts and its dependencies are
// only fetched when the chart section is rendered on the dashboard.
// webpack extracts the charting vendor code into a separate async chunk
// via the 'charts' cacheGroup in next.config.mjs (issue #89).
const PriceChart = lazy(() => import('@/components/Charts/PriceChart'));

// Sample price data for demonstration — replace with API data in production.
const samplePriceData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  price: 1.0 + Math.sin(i / 4) * 0.05 + (Math.random() - 0.5) * 0.02
}));

export default function DashboardPage() {
  const { t } = useTranslation();
  const [sendOpen, setSendOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section id="swap" className="lg:col-span-2">
          <ErrorBoundary>
            <SwapCard />
          </ErrorBoundary>
        </section>

        <section id="protocol-stats" className="lg:col-span-2">
          <ErrorBoundary>
            <ProtocolStatsBar />
          </ErrorBoundary>
        </section>

        {/* Price chart section — lazy-loaded, chunked separately (issue #89) */}
        <section id="price-chart" className="card lg:col-span-2">
          <ErrorBoundary>
            <Suspense fallback={
              <div className="h-72 flex items-center justify-center">
                <div className="w-full max-w-2xl space-y-3">
                  <SkeletonLoader height="1rem" width="40%" />
                  <SkeletonLoader height="220px" />
                </div>
              </div>
            }>
              <PriceChart data={samplePriceData} title={t('dashboard.priceChart')} />
            </Suspense>
          </ErrorBoundary>
        </section>

        <section id="staking" className="card">
          <h2 className="text-sm font-semibold text-gray-900">{t('dashboard.staking')}</h2>
          <ErrorBoundary>
            <p className="mt-2 text-sm text-gray-600">{t('dashboard.noStakes')}</p>
          </ErrorBoundary>
        </section>

        <section id="governance" className="card">
          <h2 className="text-sm font-semibold text-gray-900">{t('dashboard.governance')}</h2>
          <p className="mt-2 text-sm text-gray-600">{t('dashboard.noProposals')}</p>
        </section>

        <section id="recent-swaps" className="lg:col-span-2">
          <ErrorBoundary>
            <RecentSwaps />
          </ErrorBoundary>
        </section>

        <section id="portfolio" className="card lg:col-span-2">
          <ErrorBoundary>
            <PortfolioAssets />
          </ErrorBoundary>
          <button type="button" className="btn mt-3" onClick={() => setSendOpen(true)}>
            {t('dashboard.sendAsset')}
          </button>
        </section>

        <ErrorBoundary>
          <TransactionSimulator />
        </ErrorBoundary>

        <ErrorBoundary>
          <CachedActivity />
        </ErrorBoundary>

        <Suspense fallback={null}>
          <ErrorBoundary>
            <TransactionHistorySection />
          </ErrorBoundary>
        </Suspense>

        <ErrorBoundary>
          <PluginGrid />
        </ErrorBoundary>
      </div>
      <SendModal isOpen={sendOpen} onClose={() => setSendOpen(false)} />
    </DashboardLayout>
  );
}