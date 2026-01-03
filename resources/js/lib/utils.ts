import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency with thousand separators
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'MWK')
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number | string, currency: string = 'MWK', decimals: number = 0): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(numAmount)) return `${currency} 0`
  
  return `${currency} ${numAmount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

/**
 * Format a number with thousand separators (no currency)
 * @param amount - The amount to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string
 */
export function formatNumber(amount: number | string, decimals: number = 0): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(numAmount)) return '0'
  
  return numAmount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Format price with currency symbol (shorthand for formatCurrency)
 * @param price - The price to format
 * @param currency - The currency code (default: 'MWK')
 * @returns Formatted price string
 */
export function formatPrice(price: number | string, currency: string = 'MWK'): string {
  return formatCurrency(price, currency, 0)
}
