import { describe, it, expect } from 'vitest';
import { isLineItemArray, isValidInvoiceStatus } from './typeGuards';

describe('typeGuards', () => {
  describe('isLineItemArray', () => {
    const validItem = {
      id: '1',
      description: 'Web development',
      quantity: 1,
      rate: 500,
      amount: 500,
    };

    it('returns true for valid line items', () => {
      expect(isLineItemArray([validItem])).toBe(true);
    });

    it('returns true for empty array', () => {
      expect(isLineItemArray([])).toBe(true);
    });

    it('returns false for non-array', () => {
      expect(isLineItemArray(null)).toBe(false);
      expect(isLineItemArray('string')).toBe(false);
      expect(isLineItemArray(42)).toBe(false);
    });

    it('returns false when missing required fields', () => {
      expect(isLineItemArray([{ id: '1', description: 'test' }])).toBe(false);
    });

    it('returns false when wrong types', () => {
      expect(isLineItemArray([{ ...validItem, quantity: 'one' }])).toBe(false);
      expect(isLineItemArray([{ ...validItem, amount: null }])).toBe(false);
    });

    it('returns false for array with null elements', () => {
      expect(isLineItemArray([null])).toBe(false);
    });
  });

  describe('isValidInvoiceStatus', () => {
    it('returns true for valid statuses', () => {
      expect(isValidInvoiceStatus('unpaid')).toBe(true);
      expect(isValidInvoiceStatus('pending')).toBe(true);
      expect(isValidInvoiceStatus('upcoming')).toBe(true);
      expect(isValidInvoiceStatus('paid')).toBe(true);
    });

    it('returns false for invalid statuses', () => {
      expect(isValidInvoiceStatus('overdue')).toBe(false);
      expect(isValidInvoiceStatus('cancelled')).toBe(false);
      expect(isValidInvoiceStatus('')).toBe(false);
      expect(isValidInvoiceStatus(null)).toBe(false);
      expect(isValidInvoiceStatus(42)).toBe(false);
    });
  });
});
