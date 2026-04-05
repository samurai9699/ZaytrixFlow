import type { LineItem, Invoice } from '../types';

/**
 * Validates that an unknown value structure precisely aligns with the requirements of a LineItem array.
 * Serves as a defensive boundary for unstructured database `Json`.
 */
export function isLineItemArray(data: unknown): data is LineItem[] {
  if (!Array.isArray(data)) return false;

  return data.every((item) => {
    if (typeof item !== 'object' || item === null) return false;
    
    const obj = item as Record<string, unknown>;
    return (
      typeof obj.id === 'string' &&
      typeof obj.description === 'string' &&
      typeof obj.quantity === 'number' &&
      typeof obj.rate === 'number' &&
      typeof obj.amount === 'number'
    );
  });
}

/**
 * Ensures strict runtime assignment bounds when mapping DB states back into the component state.
 */
export function isValidInvoiceStatus(status: unknown): status is Invoice['status'] {
  return typeof status === 'string' && ['unpaid', 'pending', 'upcoming', 'paid'].includes(status);
}
