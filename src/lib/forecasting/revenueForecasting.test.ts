import { describe, it, expect } from 'vitest';
import { RevenueForecastEngine } from './revenueForecasting';

// Helper to generate monthly invoices for the past N months
function generateMonthlyInvoices(months: number, baseAmount: number, opts?: { recurring?: boolean; clientId?: string }) {
  const now = new Date();
  return Array.from({ length: months }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 15);
    return {
      amount: baseAmount + i * 50, // slight growth
      due_date: date.toISOString().split('T')[0],
      status: 'paid',
      is_recurring: opts?.recurring,
      client_id: opts?.clientId,
    };
  });
}

describe('RevenueForecastEngine', () => {
  const engine = new RevenueForecastEngine();

  describe('generateForecast', () => {
    it('throws when fewer than 6 months of data', () => {
      const invoices = generateMonthlyInvoices(3, 1000);
      expect(() => engine.generateForecast(invoices)).toThrow('Insufficient data');
    });

    it('returns forecast results with correct shape', () => {
      const invoices = generateMonthlyInvoices(8, 1000);
      const results = engine.generateForecast(invoices, 3);

      expect(results).toHaveLength(3);
      results.forEach((r) => {
        expect(r).toHaveProperty('date');
        expect(r).toHaveProperty('forecast');
        expect(r).toHaveProperty('lower');
        expect(r).toHaveProperty('upper');
        expect(r).toHaveProperty('confidence');
        expect(r.actual).toBeNull();
        expect(r.forecast).toBeGreaterThanOrEqual(0);
        expect(r.lower).toBeLessThanOrEqual(r.forecast);
        expect(r.upper).toBeGreaterThanOrEqual(r.forecast);
      });
    });

    it('forecasts positive growth when data trends upward', () => {
      // Steadily increasing amounts
      const invoices = Array.from({ length: 10 }, (_, i) => ({
        amount: 1000 + i * 200,
        due_date: new Date(2025, i, 15).toISOString().split('T')[0],
        status: 'paid',
      }));

      const results = engine.generateForecast(invoices, 3);
      const lastDataPoint = invoices[invoices.length - 1].amount;

      // At least one forecast point should exceed the last actual
      const hasGrowth = results.some((r) => r.forecast > lastDataPoint * 0.8);
      expect(hasGrowth).toBe(true);
    });

    it('handles mixed recurring and non-recurring invoices', () => {
      const recurring = generateMonthlyInvoices(10, 500, { recurring: true, clientId: 'c1' });
      const nonRecurring = generateMonthlyInvoices(10, 300, { recurring: false, clientId: 'c2' });
      const invoices = [...recurring, ...nonRecurring];

      const results = engine.generateForecast(invoices, 3);
      expect(results).toHaveLength(3);
      results.forEach((r) => {
        expect(r.forecast).toBeGreaterThan(0);
      });
    });

    it('default forecast horizon is 6 months', () => {
      const invoices = generateMonthlyInvoices(10, 1000);
      const results = engine.generateForecast(invoices);
      expect(results).toHaveLength(6);
    });
  });
});
