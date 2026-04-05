import { supabase } from '../lib/supabase';

import type { Invoice, LineItem } from '../types';

export function generateInvoiceEmailHTML(invoice: Invoice, includePaymentLink = false): string {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  let lineItemsHTML = '';
  const items = Array.isArray(invoice.line_items) ? (invoice.line_items as unknown as LineItem[]) : [];
  
  if (items.length > 0) {
    lineItemsHTML = `
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Description</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Quantity</th>
            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Rate</th>
            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
              <td style="padding: 12px; text-align: center; border-bottom: 1px solid #e5e7eb;">${item.quantity}</td>
              <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">${formatCurrency(item.rate, invoice.currency)}</td>
              <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">${formatCurrency(item.amount, invoice.currency)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #374151;
          margin: 0;
          padding: 0;
          background: #f9fafb;
        }
        .container {
          max-width: 650px;
          margin: 40px auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
        }
        .invoice-details {
          background: #f9fafb;
          padding: 25px;
          margin: 25px 0;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: 600;
          color: #6b7280;
        }
        .detail-value {
          color: #111827;
        }
        .amount {
          font-size: 36px;
          font-weight: bold;
          color: #667eea;
          margin: 20px 0;
          text-align: center;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 8px;
          margin: 25px 0;
          font-weight: 600;
          text-align: center;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Invoice from Zaytrix Flow</h1>
        </div>
        <div class="content">
          <p style="font-size: 16px; margin-bottom: 10px;">Dear ${invoice.client_name},</p>

          <p style="font-size: 15px; color: #6b7280;">Thank you for your business. Please find the details of your invoice below:</p>

          <div class="invoice-details">
            <div class="detail-row">
              <span class="detail-label">Invoice Number:</span>
              <span class="detail-value">${invoice.invoice_number}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Issue Date:</span>
              <span class="detail-value">${formatDate(invoice.issue_date)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Due Date:</span>
              <span class="detail-value">${formatDate(invoice.due_date)}</span>
            </div>
            ${invoice.description ? `
              <div class="detail-row">
                <span class="detail-label">Description:</span>
                <span class="detail-value">${invoice.description}</span>
              </div>
            ` : ''}
          </div>

          ${lineItemsHTML}

          <div style="text-align: center; margin: 30px 0;">
            <p style="margin: 10px 0; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">Amount Due</p>
            <div class="amount">${formatCurrency(invoice.amount, invoice.currency)}</div>
          </div>

          ${includePaymentLink ? `
            <div style="text-align: center;">
              <a href="#" class="button">Pay Now</a>
            </div>
          ` : ''}

          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
            Please process this payment by the due date. If you have any questions about this invoice,
            please don't hesitate to contact us.
          </p>

          <div class="footer">
            <p style="margin: 5px 0; font-weight: 600; color: #111827;">Zaytrix Flow</p>
            <p style="margin: 5px 0;">Invoice Management System</p>
            <p style="margin: 15px 0 5px 0; font-size: 13px;">This is an automated email. Please do not reply directly.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendInvoiceEmail(
  invoice: Invoice,
  userId: string,
  attachPDF = false
): Promise<{ success: boolean; error?: string }> {
  try {
    const html = generateInvoiceEmailHTML(invoice, false);
    const subject = `Invoice ${invoice.invoice_number} from Zaytrix Flow`;

    const payload: Record<string, unknown> = {
      to: invoice.client_email,
      subject,
      html,
      userId,
      invoiceId: invoice.id,
    };

    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send email');
    }

    return { success: true };
  } catch (error: Error | unknown) {
    console.error('Error sending invoice email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function triggerAutomatedReminders(): Promise<{ success: boolean; error?: string }> {
  try {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-invoice-reminders`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send reminders');
    }

    return { success: true };
  } catch (error: Error | unknown) {
    console.error('Error triggering automated reminders:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getEmailLogs(userId: string, invoiceId?: string) {
  let query = supabase
    .from('email_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (invoiceId) {
    query = query.eq('invoice_id', invoiceId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching email logs:', error);
    return [];
  }

  return data || [];
}
