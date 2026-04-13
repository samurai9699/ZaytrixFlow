import { describe, it, expect } from 'vitest';
import { calculateMetrics, formatCurrency, getRelativeTime, generateChartData } from './dashboardUtils';
import type { Invoice } from '../types';

describe('dashboardUtils Unit Tests', () => {
  describe('formatCurrency', () => {
    it('should format numbers to USD correctly', () => {
      expect(formatCurrency(1500)).toBe('$1,500');
      expect(formatCurrency(0)).toBe('$0');
      expect(formatCurrency(2500000)).toBe('$2,500,000');
    });
  });

  describe('getRelativeTime', () => {
    it('should format recent times correctly', () => {
      const now = new Date();
      
      const justNowDate = new Date(now.getTime() - (1000 * 60 * 30)).toISOString(); // 30 mins ago
      expect(getRelativeTime(justNowDate)).toBe('Just now');
      
      const hoursAgoDate = new Date(now.getTime() - (1000 * 60 * 60 * 5)).toISOString(); // 5 hours ago
      expect(getRelativeTime(hoursAgoDate)).toBe('5 hours ago');
      
      const daysAgoDate = new Date(now.getTime() - (1000 * 60 * 60 * 24 * 3)).toISOString(); // 3 days ago
      expect(getRelativeTime(daysAgoDate)).toBe('3 days ago');
    });
  });

  describe('calculateMetrics', () => {
    it('should aggregate totals by status and handle due dates properly', () => {
      const now = new Date();
      const pastDate = new Date(now.getTime() - (1000 * 60 * 60 * 24 * 10)).toISOString(); // 10 days ago
      const futureDate = new Date(now.getTime() + (1000 * 60 * 60 * 24 * 10)).toISOString(); // 10 days future
      
      const mockInvoices: Partial<Invoice>[] = [
        { id: '1', amount: 100, status: 'paid', due_date: pastDate },
        { id: '2', amount: 250, status: 'paid', due_date: pastDate },
        
        // This is overdue
        { id: '3', amount: 500, status: 'unpaid', due_date: pastDate },
        // This is unpaid but NOT overdue (should NOT be counted in totalUnpaid metric based on logical condition)
        { id: '4', amount: 1000, status: 'unpaid', due_date: futureDate },
        
        { id: '5', amount: 300, status: 'pending', due_date: futureDate },
        
        { id: '6', amount: 150, status: 'draft', due_date: futureDate },
        { id: '7', amount: 200, status: 'upcoming', due_date: futureDate },
      ];

      const metrics = calculateMetrics(mockInvoices as Invoice[], 10);

      expect(metrics.totalClients).toBe(10);
      
      // Paid metrics
      expect(metrics.totalPaid).toBe(2);
      expect(metrics.paidAmount).toBe(350); // 100 + 250
      
      // Unpaid metrics (only overdue ones are counted by business logic)
      expect(metrics.totalUnpaid).toBe(1);
      expect(metrics.unpaidAmount).toBe(500);
      
      // Pending metrics
      expect(metrics.totalPending).toBe(1);
      expect(metrics.pendingAmount).toBe(300);
      
      // Upcoming/Draft metrics
      expect(metrics.totalUpcoming).toBe(2);
      expect(metrics.upcomingAmount).toBe(350); // 150 + 200
    });
  });

  describe('generateChartData', () => {
    it('should summarize paid and unpaid invoices for current year months', () => {
      const currentYear = new Date().getFullYear();
      
      const mockInvoices: Partial<Invoice>[] = [
        // January
        { id: '1', amount: 500, status: 'paid', created_at: new Date(currentYear, 0, 15).toISOString() },
        { id: '2', amount: 200, status: 'unpaid', created_at: new Date(currentYear, 0, 10).toISOString() },
        // February
        { id: '3', amount: 1000, status: 'paid', created_at: new Date(currentYear, 1, 15).toISOString() },
      ];

      const chartData = generateChartData(mockInvoices as Invoice[]);

      // Ensure 6 months returned
      expect(chartData.length).toBe(6);
      
      // Jan checks
      expect(chartData[0].month).toBe('Jan');
      expect(chartData[0].paid).toBe(500);
      expect(chartData[0].unpaid).toBe(200);
      expect(chartData[0].total).toBe(700);

      // Feb checks
      expect(chartData[1].month).toBe('Feb');
      expect(chartData[1].paid).toBe(1000);
      expect(chartData[1].unpaid).toBe(0);
      
      // March checks (empty)
      expect(chartData[2].month).toBe('Mar');
      expect(chartData[2].paid).toBe(0);
      expect(chartData[2].total).toBe(0);
    });
  });
});
