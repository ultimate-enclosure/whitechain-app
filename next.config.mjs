/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb'
    }
  },
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'images.coingecko.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'metadata.ens.domains',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'euc.li',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        pathname: '/**'
      }
    ]
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@x402/core/client': false,
      '@x402/svm/exact/client': false,
      '@x402/evm': false,
      'pino-pretty': false,
      '@react-native-async-storage/async-storage': false
    };

    // Route-level code splitting for charting libraries (issue #89).
    // Charting vendors (recharts, d3, lightweight-charts, etc.) are
    // extracted into a separate async 'vendor-charts' chunk that is only
    // fetched when a chart component is rendered via React.lazy(). This
    // keeps them out of the initial First Load JS on non-chart routes.
    if (config.optimization && config.optimization.splitChunks) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        charts: {
          test: /[\\/]node_modules[\\/](recharts|d3|d3-|victory|lightweight-charts|tradingview)[\\/]/,
          name: 'vendor-charts',
          chunks: 'async',
          priority: 20,
          reuseExistingChunk: true
        }
      };
    }

    return config;
  }
};

export default nextConfig;