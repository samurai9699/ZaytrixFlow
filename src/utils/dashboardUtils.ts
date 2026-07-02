import type { Invoice } from '../types';

export interface InvoiceMetrics {
  totalUnpaid: number;
  totalPending: number;
  totalUpcoming: number;
  totalPaid: number;
  unpaidAmount: number;
  pendingAmount: number;
  upcomingAmount: number;
  paidAmount: number;
  totalClients: number;
}

export interface ChartData {
  month: string;
  unpaid: number;
  paid: number;
  total: number;
}

export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateLong = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return date.toLocaleDateString();
};

export const getActivityType = (status: string) => {
  switch (status) {
    case 'paid': return 'success';
    case 'unpaid': return 'error';
    case 'pending': return 'warning';
    default: return 'info';
  }
};

export const getActivityTitle = (invoice: Invoice) => {
  switch (invoice.status) {
    case 'paid': return 'Invoice Paid';
    case 'unpaid': return 'Invoice Overdue';
    case 'pending': return 'Payment Pending';
    case 'upcoming': return 'Invoice Created';
    default: return 'Invoice Updated';
  }
};

export interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: string;
  status: string;
}

export const generateRecentActivity = (invoices: Invoice[]): Activity[] => {
  return invoices
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
    .map(invoice => ({
      id: invoice.id,
      title: getActivityTitle(invoice),
      description: `${invoice.client_name} - $${parseFloat(invoice.amount.toString()).toLocaleString()}`,
      time: getRelativeTime(invoice.created_at),
      type: getActivityType(invoice.status),
      status: invoice.status
    }));
};

export const generateChartData = (invoices: Invoice[]): ChartData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const currentYear = new Date().getFullYear();
  
  return months.map((month, index) => {
    const monthStart = new Date(currentYear, index, 1);
    const monthEnd = new Date(currentYear, index + 1, 0);
    
    const monthInvoices = invoices.filter(invoice => {
      const createdAt = new Date(invoice.created_at);
      return createdAt >= monthStart && createdAt <= monthEnd;
    });

    const unpaid = monthInvoices
      .filter(inv => inv.status === 'unpaid')
      .reduce((sum, inv) => sum + parseFloat(inv.amount.toString()), 0);
    
    const paid = monthInvoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + parseFloat(inv.amount.toString()), 0);

    return {
      month,
      unpaid: Math.round(unpaid),
      paid: Math.round(paid),
      total: Math.round(unpaid + paid)
    };
  });
};

export const calculateMetrics = (invoices: Invoice[], clientCount: number): InvoiceMetrics => {
  return invoices.reduce((acc, invoice) => {
    const amount = parseFloat(invoice.amount.toString());
    
    switch (invoice.status) {
      case 'unpaid':
        if (new Date(invoice.due_date) < new Date()) {
          acc.totalUnpaid++;
          acc.unpaidAmount += amount;
        }
        break;
      case 'draft':
      case 'upcoming':
        acc.totalUpcoming++;
        acc.upcomingAmount += amount;
        break;
      case 'pending':
        acc.totalPending++;
        acc.pendingAmount += amount;
        break;
      case 'paid':
        acc.totalPaid++;
        acc.paidAmount += amount;
        break;
    }
    return acc;
  }, {
    totalUnpaid: 0,
    totalPending: 0,
    totalUpcoming: 0,
    totalPaid: 0,
    unpaidAmount: 0,
    pendingAmount: 0,
    upcomingAmount: 0,
    paidAmount: 0,
    totalClients: clientCount
  });
};
