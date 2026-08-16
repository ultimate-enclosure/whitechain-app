// @ts-nocheck
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PricePoint {
  time: string;
  price: number;
}

interface PriceChartProps {
  data: PricePoint[];
  title?: string;
}

export function PriceChart({ data, title }: PriceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        No data available
      </div>
    );
  }

  const isPositive = data.length >= 2 && data[data.length - 1].price >= data[0].price;
  const color = isPositive ? '#22c55e' : '#ef4444';

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={256}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={60}
            tickFormatter={(v) => v.toFixed(2)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PriceChart;