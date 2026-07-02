import { describe, it, expect } from 'vitest';
import { STRIPE_PRODUCTS, getProductByPriceId } from './stripe-config';

describe('stripe-config', () => {
  describe('STRIPE_PRODUCTS', () => {
    it('has pro and premium products', () => {
      expect(STRIPE_PRODUCTS.pro).toBeDefined();
      expect(STRIPE_PRODUCTS.premium).toBeDefined();
    });

    it('each product has monthly and annual prices', () => {
      Object.values(STRIPE_PRODUCTS).forEach((product) => {
        expect(product.monthlyPrice).toBeGreaterThan(0);
        expect(product.annualPrice).toBeGreaterThan(0);
        expect(product.monthlyPriceId).toMatch(/^price_/);
        expect(product.annualPriceId).toMatch(/^price_/);
      });
    });
  });

  describe('getProductByPriceId', () => {
    it('finds pro by monthly price ID', () => {
      const result = getProductByPriceId('price_1RX7OODnl7eA7o2ILPyqAk3r');
      expect(result).toBe(STRIPE_PRODUCTS.pro);
    });

    it('finds pro by annual price ID', () => {
      const result = getProductByPriceId('price_1RX7TcDnl7eA7o2IAROVqhIK');
      expect(result).toBe(STRIPE_PRODUCTS.pro);
    });

    it('finds premium by monthly price ID', () => {
      const result = getProductByPriceId('price_1RX7RLDnl7eA7o2ImjEdcoOa');
      expect(result).toBe(STRIPE_PRODUCTS.premium);
    });

    it('returns undefined for unknown price ID', () => {
      const result = getProductByPriceId('price_unknown');
      expect(result).toBeUndefined();
    });

    it('returns undefined for empty string', () => {
      const result = getProductByPriceId('');
      expect(result).toBeUndefined();
    });
  });
});
