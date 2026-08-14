import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CurrencyCode } from '../types/finance';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CURRENCY_CONFIGS: Record<CurrencyCode, { symbol: string; name: string; locale: string }> = {
  INR: { symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  USD: { symbol: '$', name: 'US Dollar', locale: 'en-US' },
  EUR: { symbol: '€', name: 'Euro', locale: 'de-DE' },
  GBP: { symbol: '£', name: 'British Pound', locale: 'en-GB' },
  CAD: { symbol: 'CA$', name: 'Canadian Dollar', locale: 'en-CA' },
  AUD: { symbol: 'AU$', name: 'Australian Dollar', locale: 'en-AU' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
  JPY: { symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  AED: { symbol: 'AED', name: 'UAE Dirham', locale: 'en-AE' },
};

export const CURRENCIES_LIST = (Object.keys(CURRENCY_CONFIGS) as CurrencyCode[]).map((code) => ({
  code,
  symbol: CURRENCY_CONFIGS[code].symbol,
  name: CURRENCY_CONFIGS[code].name,
  locale: CURRENCY_CONFIGS[code].locale,
}));

export function formatCurrency(amount: number, currency: CurrencyCode = 'INR', maximumFractionDigits: number = 0): string {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.INR;
  const absAmount = Math.abs(amount);
  
  const formatted = new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.symbol === '₹' ? 'INR' : currency,
    currencyDisplay: 'symbol',
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(absAmount);

  // If INR, handle formatting symbol cleanly
  if (currency === 'INR') {
    const numPart = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits,
      minimumFractionDigits: 0,
    }).format(absAmount);
    return `${amount < 0 ? '-' : ''}₹${numPart}`;
  }

  return `${amount < 0 ? '-' : ''}${formatted}`;
}

export function formatCompactNumber(amount: number, currency: CurrencyCode = 'INR'): string {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.INR;
  const symbol = config.symbol;
  
  if (Math.abs(amount) >= 10000000) {
    return `${symbol}${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (Math.abs(amount) >= 100000) {
    return `${symbol}${(amount / 100000).toFixed(1)} L`;
  }
  if (Math.abs(amount) >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(1)}k`;
  }
  return formatCurrency(amount, currency);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatRelativeDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;

  return formatDate(dateString);
}

export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToCSV<T extends Record<string, any>>(data: T[], filename: string) {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Header row
  csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));

  // Data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      if (val === null || val === undefined) return '""';
      if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  downloadFile(`${filename}.csv`, csvRows.join('\n'), 'text/csv;charset=utf-8;');
}

export function exportToJSON(data: any, filename: string) {
  const jsonStr = JSON.stringify(data, null, 2);
  downloadFile(`${filename}.json`, jsonStr, 'application/json;charset=utf-8;');
}
