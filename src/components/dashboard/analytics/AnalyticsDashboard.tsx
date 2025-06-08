import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, Filter } from 'lucide-react';
import GridLayout from 'react-grid-layout';
import PaymentTrends from './widgets/PaymentTrends';
import CollectionPerformance from './widgets/CollectionPerformance';
import AgingAnalysis from './widgets/AgingAnalysis';
import RevenueForecast from './widgets/RevenueForecast';
import ClientRisk from './widgets/ClientRisk';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import 'react-grid-layout/css/styles.css';

interface Invoice {
  id: string;
  amount: number;
  due_date: string;
  paid_date?: string;
  status: 'paid' | 'unpaid' | 'pending' | 'overdue';
  client?: {
    id: string;
    name: string;
    industry: string;
  };
}

interface PaymentTrendData {
  date: string;
  received: number;
  expected: number;
}

interface CollectionPerformanceData {
  label: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
}

interface AgingAnalysisData {
  range: string;
  amount: number;
  percentage: number;
}

interface RevenueForecastData {
  date: string;
  actual: number | null;
  forecast: number;
  lower: number;
  upper: number;
}

interface ClientRiskData {
  name: string;
  industry: string;
  riskScore: number;
  overdueAmount: number;
}

interface AnalyticsData {
  paymentTrends: PaymentTrendData[];
  collectionPerformance: CollectionPerformanceData[];
  agingAnalysis: AgingAnalysisData[];
  revenueForecast: RevenueForecastData[];
  clientRisk: ClientRiskData[];
  metrics: {
    totalReceivables: number;
    avgDaysToPay: number;
    collectionRate: number;
    overdueAmount: number;
  };
}

interface CSVRow {
  [key: string]: string | number;
}

const AnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('last30');
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    paymentTrends: [],
    collectionPerformance: [],
    agingAnalysis: [],
    revenueForecast: [],
    clientRisk: [],
    metrics: {
      totalReceivables: 0,
      avgDaysToPay: 0,
      collectionRate: 0,
      overdueAmount: 0
    }
  });
  const { user } = useAuth();

  const layout = [
    { i: 'payment-trends', x: 0, y: 0, w: 12, h: 8 },
    { i: 'collection-performance', x: 0, y: 8, w: 6, h: 6 },
    { i: 'aging-analysis', x: 6, y: 8, w: 6, h: 6 },
    { i: 'revenue-forecast', x: 0, y: 14, w: 8, h: 8 },
    { i: 'client-risk', x: 8, y: 14, w: 4, h: 8 },
  ];

  const fetchAnalyticsData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Fetch invoices based on date range
      const startDate = getStartDate(dateRange);
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select(`
          *,
          clients (
            id,
            name,
            industry
          )
        `)
        .eq('user_id', user.id)
        .gte('due_date', startDate.toISOString())
        .order('due_date', { ascending: true });

      if (invoicesError) throw invoicesError;

      // Process data for different widgets
      const processedData = processAnalyticsData(invoices || []);
      setAnalyticsData(processedData);

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStartDate = (range: string) => {
    const now = new Date();
    switch (range) {
      case 'last7':
        return new Date(now.setDate(now.getDate() - 7));
      case 'last30':
        return new Date(now.setDate(now.getDate() - 30));
      case 'last90':
        return new Date(now.setDate(now.getDate() - 90));
      default:
        return new Date(now.setDate(now.getDate() - 30));
    }
  };

  const processAnalyticsData = (invoices: Invoice[]): AnalyticsData => {
    // Calculate total receivables and other metrics
    const metrics = invoices.reduce((acc, invoice) => {
      const amount = invoice.amount;
      const dueDate = new Date(invoice.due_date);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

      acc.totalReceivables += amount;
      if (invoice.status === 'paid') {
        acc.collectionRate += 1;
      }
      if (daysDiff > 0 && invoice.status !== 'paid') {
        acc.overdueAmount += amount;
      }
      if (invoice.status === 'paid' && invoice.paid_date) {
        const paidDate = new Date(invoice.paid_date);
        const dueDateObj = new Date(invoice.due_date);
        acc.avgDaysToPay += Math.floor((paidDate.getTime() - dueDateObj.getTime()) / (1000 * 60 * 60 * 24));
      }
      return acc;
    }, {
      totalReceivables: 0,
      avgDaysToPay: 0,
      collectionRate: 0,
      overdueAmount: 0
    });

    // Calculate averages and percentages
    const totalInvoices = invoices.length || 1;
    metrics.avgDaysToPay = Math.round(metrics.avgDaysToPay / (totalInvoices * 0.8)); // Assuming 80% paid
    metrics.collectionRate = Math.round((metrics.collectionRate / totalInvoices) * 100);

    // Process data for each widget
    const paymentTrends = processPaymentTrends(invoices);
    const collectionPerformance = processCollectionPerformance(invoices);
    const agingAnalysis = processAgingAnalysis(invoices);
    const revenueForecast = processRevenueForecast(invoices);
    const clientRisk = processClientRisk(invoices);

    return {
      paymentTrends,
      collectionPerformance,
      agingAnalysis,
      revenueForecast,
      clientRisk,
      metrics
    };
  };

  const processPaymentTrends = (invoices: Invoice[]): PaymentTrendData[] => {
    const today = new Date();
    const dates = new Array(getDateRangeLength()).fill(0).map((_, index) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (getDateRangeLength() - 1 - index));
      return date.toISOString().split('T')[0];
    });

    return dates.map(date => {
      const dayInvoices = invoices.filter(inv => inv.due_date.split('T')[0] === date);
      const received = dayInvoices.filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0);
      const expected = dayInvoices.reduce((sum, inv) => sum + inv.amount, 0);

      return {
        date,
        received,
        expected
      };
    });
  };

  const processCollectionPerformance = (invoices: Invoice[]): CollectionPerformanceData[] => {
    const ranges = [
      { label: '0-30 days', min: 0, max: 30 },
      { label: '31-60 days', min: 31, max: 60 },
      { label: '61-90 days', min: 61, max: 90 },
      { label: '90+ days', min: 91, max: Infinity }
    ];

    return ranges.map(range => {
      const rangeInvoices = invoices.filter(inv => {
        const dueDate = new Date(inv.due_date);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff >= range.min && daysDiff <= range.max;
      });

      const total = rangeInvoices.length;
      const paid = rangeInvoices.filter(inv => inv.status === 'paid').length;
      const value = total ? Math.round((paid / total) * 100) : 0;
      const target = range.max === Infinity ? 40 : 90 - (range.min / 2);

      return {
        label: range.label,
        value,
        target,
        trend: value >= target ? 'up' : 'down'
      };
    });
  };

  const processAgingAnalysis = (invoices: Invoice[]): AgingAnalysisData[] => {
    const ranges = [
      { range: 'Current', min: -Infinity, max: 0 },
      { range: '1-30', min: 1, max: 30 },
      { range: '31-60', min: 31, max: 60 },
      { range: '61-90', min: 61, max: 90 },
      { range: '90+', min: 91, max: Infinity }
    ];

    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);

    return ranges.map(range => {
      const amount = invoices.filter(inv => {
        const dueDate = new Date(inv.due_date);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff >= range.min && daysDiff <= range.max;
      }).reduce((sum, inv) => sum + inv.amount, 0);

      return {
        range: range.range,
        amount,
        percentage: totalAmount ? Math.round((amount / totalAmount) * 100) : 0
      };
    });
  };

  const processRevenueForecast = (invoices: Invoice[]): RevenueForecastData[] => {
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
    const sixMonthsAhead = new Date(today.getFullYear(), today.getMonth() + 6, 0);

    // Group invoices by month
    const monthlyData = new Map();
    invoices.forEach(inv => {
      const date = new Date(inv.due_date);
      const key = date.toISOString().substring(0, 7); // YYYY-MM format
      const amount = inv.amount;

      if (!monthlyData.has(key)) {
        monthlyData.set(key, { actual: 0, total: 0 });
      }

      const data = monthlyData.get(key);
      data.total += amount;
      if (inv.status === 'paid') {
        data.actual += amount;
      }
    });

    // Calculate average monthly growth
    const sortedMonths = Array.from(monthlyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .filter(([date]) => date <= today.toISOString().substring(0, 7));

    let avgGrowth = 0;
    if (sortedMonths.length > 1) {
      const growthRates = [];
      for (let i = 1; i < sortedMonths.length; i++) {
        const prev = sortedMonths[i - 1][1].total;
        const curr = sortedMonths[i][1].total;
        if (prev > 0) {
          growthRates.push((curr - prev) / prev);
        }
      }
      avgGrowth = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
    }

    // Generate forecast data
    const forecastData: RevenueForecastData[] = [];
    let currentDate = new Date(sixMonthsAgo);
    let lastActual = null;

    while (currentDate <= sixMonthsAhead) {
      const key = currentDate.toISOString().substring(0, 7);
      const monthData = monthlyData.get(key);

      const baseValue: number = lastActual || (monthData?.total || 50000);
      const forecast: number = baseValue * (1 + avgGrowth);
      const confidence = 0.2; // 20% confidence interval

      forecastData.push({
        date: key,
        actual: currentDate <= today ? (monthData?.actual || null) : null,
        forecast: currentDate > today ? forecast : baseValue,
        lower: currentDate > today ? forecast * (1 - confidence) : baseValue * 0.9,
        upper: currentDate > today ? forecast * (1 + confidence) : baseValue * 1.1
      });

      if (forecastData[forecastData.length - 1].actual !== null) {
        lastActual = forecastData[forecastData.length - 1].actual;
      }

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return forecastData;
  };

  const processClientRisk = (invoices: Invoice[]): ClientRiskData[] => {
    const clientData = new Map<string, {
      name: string;
      industry: string;
      totalAmount: number;
      overdueAmount: number;
      latePayments: number;
      totalPayments: number;
    }>();

    invoices.forEach(inv => {
      if (!inv.client?.id) return;

      if (!clientData.has(inv.client.id)) {
        clientData.set(inv.client.id, {
          name: inv.client.name,
          industry: inv.client.industry,
          totalAmount: 0,
          overdueAmount: 0,
          latePayments: 0,
          totalPayments: 0
        });
      }

      const data = clientData.get(inv.client.id)!;
      const amount = inv.amount;
      const dueDate = new Date(inv.due_date);
      const now = new Date();

      data.totalAmount += amount;
      if (dueDate < now && inv.status !== 'paid') {
        data.overdueAmount += amount;
      }

      if (inv.status === 'paid' && inv.paid_date) {
        data.totalPayments++;
        const paidDate = new Date(inv.paid_date);
        if (paidDate > dueDate) {
          data.latePayments++;
        }
      }
    });

    // Calculate risk scores
    return Array.from(clientData.values()).map(client => {
      const latePaymentRatio = client.totalPayments > 0 ?
        (client.latePayments / client.totalPayments) * 100 : 0;
      const overdueRatio = client.totalAmount > 0 ?
        (client.overdueAmount / client.totalAmount) * 100 : 0;

      // Risk score is weighted average of late payment history and current overdue ratio
      const riskScore = Math.round((latePaymentRatio * 0.4) + (overdueRatio * 0.6));

      return {
        name: client.name,
        industry: client.industry,
        riskScore: Math.min(100, riskScore),
        overdueAmount: client.overdueAmount
      };
    });
  };

  const getDateRangeLength = () => {
    switch (dateRange) {
      case 'last7':
        return 7;
      case 'last30':
        return 30;
      case 'last90':
        return 90;
      default:
        return 30;
    }
  };

  const handleExport = () => {
    // Prepare data for each section
    const paymentTrendsCSV = analyticsData.paymentTrends.map(item => ({
      Date: new Date(item.date).toLocaleDateString(),
      'Received Amount': item.received.toFixed(2),
      'Expected Amount': item.expected.toFixed(2)
    }));

    const collectionPerformanceCSV = analyticsData.collectionPerformance.map(item => ({
      'Age Range': item.label,
      'Collection Rate': `${item.value}%`,
      'Target': `${item.target}%`,
      'Performance': item.trend
    }));

    const agingAnalysisCSV = analyticsData.agingAnalysis.map(item => ({
      'Age Range': `${item.range} days`,
      'Amount': item.amount.toFixed(2),
      'Percentage': `${item.percentage}%`
    }));

    const clientRiskCSV = analyticsData.clientRisk.map(item => ({
      'Client Name': item.name,
      'Industry': item.industry,
      'Risk Score': item.riskScore,
      'Overdue Amount': item.overdueAmount.toFixed(2)
    }));

    // Convert to CSV format
    const convertToCSV = (data: CSVRow[], title: string) => {
      if (data.length === 0) return '';

      const headers = Object.keys(data[0]);
      const rows = data.map(row => headers.map(header => row[header]).join(','));

      return `${title}\n${headers.join(',')}\n${rows.join('\n')}\n\n`;
    };

    // Combine all sections
    const csvContent = [
      `Financial Analytics Report - ${new Date().toLocaleDateString()}\n\n`,
      'Summary Metrics\n',
      `Total Receivables,${analyticsData.metrics.totalReceivables.toFixed(2)}\n`,
      `Average Days to Pay,${analyticsData.metrics.avgDaysToPay}\n`,
      `Collection Rate,${analyticsData.metrics.collectionRate}%\n`,
      `Overdue Amount,${analyticsData.metrics.overdueAmount.toFixed(2)}\n\n`,
      convertToCSV(paymentTrendsCSV, 'Payment Trends'),
      convertToCSV(collectionPerformanceCSV, 'Collection Performance'),
      convertToCSV(agingAnalysisCSV, 'Aging Analysis'),
      convertToCSV(clientRiskCSV, 'Client Risk Analysis')
    ].join('');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `financial_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, user]);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Analytics</h1>
              <p className="text-gray-500 dark:text-gray-400">Track and analyze your payment performance</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setDateRange('last7')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${dateRange === 'last7'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  7D
                </button>
                <button
                  onClick={() => setDateRange('last30')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${dateRange === 'last30'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  30D
                </button>
                <button
                  onClick={() => setDateRange('last90')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${dateRange === 'last90'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  90D
                </button>
                <button
                  onClick={() => setDateRange('custom')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-2 ${dateRange === 'custom'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  <Calendar size={16} />
                  Custom
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Filter size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2"
                onClick={handleExport}
              >
                <Download size={20} />
                Export
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Total Receivables',
                value: new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0
                }).format(analyticsData.metrics.totalReceivables),
                change: '+12.5%',
                trend: 'up',
              },
              {
                title: 'Average Days to Pay',
                value: `${analyticsData.metrics.avgDaysToPay} days`,
                change: '-2.3 days',
                trend: 'down',
              },
              {
                title: 'Collection Rate',
                value: `${analyticsData.metrics.collectionRate}%`,
                change: '+3.2%',
                trend: 'up',
              },
              {
                title: 'Overdue Amount',
                value: new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0
                }).format(analyticsData.metrics.overdueAmount),
                change: '-15.4%',
                trend: 'down',
              },
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {metric.title}
                </h3>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metric.value}
                  </p>
                  <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-success-600' : 'text-error-600'
                    }`}>
                    {metric.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <GridLayout
              className="layout"
              layout={layout}
              cols={12}
              rowHeight={30}
              width={1200}
              isDraggable
              isResizable
              margin={[16, 16]}
            >
              <div key="payment-trends">
                <PaymentTrends data={analyticsData.paymentTrends} dateRange={dateRange} />
              </div>
              <div key="collection-performance">
                <CollectionPerformance data={analyticsData.collectionPerformance} />
              </div>
              <div key="aging-analysis">
                <AgingAnalysis data={analyticsData.agingAnalysis} />
              </div>
              <div key="revenue-forecast">
                <RevenueForecast data={analyticsData.revenueForecast} />
              </div>
              <div key="client-risk">
                <ClientRisk data={analyticsData.clientRisk} />
              </div>
            </GridLayout>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;