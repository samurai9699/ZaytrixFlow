import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  calculateMetrics,
  generateChartData,
  generateRecentActivity,
  InvoiceMetrics,
  ChartData
} from '../utils/dashboardUtils';

interface DashboardMetricsData {
  metrics: InvoiceMetrics;
  chartData: ChartData[];
  recentActivity: any[];
}

export const useDashboardMetrics = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<DashboardMetricsData>({
    queryKey: ['dashboard_data', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Fetch client count
      const { count: clientCount, error: clientError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (clientError) throw clientError;

      // Fetch invoices
      const { data: invoices, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id);

      if (invoiceError) throw invoiceError;

      // Process data
      const metrics = calculateMetrics(invoices || [], clientCount || 0);
      const chartData = generateChartData(invoices || []);
      const recentActivity = generateRecentActivity(invoices || []);

      return { metrics, chartData, recentActivity };
    },
    enabled: !!user,
  });

  // Setup real-time subscription
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('invoices_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['dashboard_data', user.id] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, queryClient]);

  // Provide sensible defaults while loading or on error
  const defaultMetrics: InvoiceMetrics = {
    totalUnpaid: 0,
    totalPending: 0,
    totalUpcoming: 0,
    totalPaid: 0,
    unpaidAmount: 0,
    pendingAmount: 0,
    upcomingAmount: 0,
    paidAmount: 0,
    totalClients: 0,
  };

  return {
    metrics: data?.metrics || defaultMetrics,
    chartData: data?.chartData || [],
    recentActivity: data?.recentActivity || [],
    isLoading,
    error,
  };
};
