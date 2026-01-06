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

/**
 * Format a date as dd-mmmm-yy (e.g., "04-January-26")
 * @param date - The date to format (string, Date, or null/undefined)
 * @returns Formatted date string or empty string if invalid
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return ''

  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''

  const day = d.getDate().toString().padStart(2, '0')
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const month = months[d.getMonth()]
  const year = d.getFullYear().toString().slice(-2)

  return `${day}-${month}-${year}`
}

/**
 * Format a date and time as dd-mmmm-yy HH:MM (e.g., "04-January-26 14:30")
 * @param date - The date to format (string, Date, or null/undefined)
 * @returns Formatted datetime string or empty string if invalid
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return ''

  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''

  const dateStr = formatDate(d)
  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')

  return `${dateStr} ${hours}:${minutes}`
}

/**
 * Format a time as HH:MM (e.g., "14:30")
 * @param date - The date to extract time from (string, Date, or null/undefined)
 * @returns Formatted time string or empty string if invalid
 */
export function formatTime(date: string | Date | null | undefined): string {
  if (!date) return ''

  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''

  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')

  return `${hours}:${minutes}`
}

/**
 * Get the full URL for a storage file
 * @param path - The file path (can be null, undefined, full URL, /storage/ prefixed, or relative path)
 * @param fallback - Optional fallback image path (default: '/placeholder.jpg')
 * @returns Full URL to the image
 */
export function getStorageUrl(path: string | null | undefined, fallback: string = '/placeholder.jpg'): string {
  if (!path) return fallback
  if (path.startsWith('http') || path.startsWith('/storage/')) return path
  return `/storage/${path}`
}
