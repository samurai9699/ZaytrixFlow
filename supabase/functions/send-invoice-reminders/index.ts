import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

function generateReminderEmail(invoice: any, daysOverdue: number): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .invoice-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }
        .amount { font-size: 32px; font-weight: bold; color: #667eea; margin: 10px 0; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .warning { color: #dc2626; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Reminder</h1>
        </div>
        <div class="content">
          <p>Dear ${invoice.client_name},</p>

          <p>This is a friendly reminder that the following invoice is now <span class="warning">${daysOverdue} days overdue</span>.</p>

          <div class="invoice-details">
            <p><strong>Invoice Number:</strong> ${invoice.invoice_number}</p>
            <p><strong>Issue Date:</strong> ${new Date(invoice.issue_date).toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> ${new Date(invoice.due_date).toLocaleDateString()}</p>
            <p><strong>Amount Due:</strong></p>
            <div class="amount">${new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(invoice.amount)}</div>
          </div>

          <p>Please process this payment at your earliest convenience to avoid any service interruptions.</p>

          <p>If you have already sent the payment, please disregard this reminder and accept our thanks.</p>

          <p>If you have any questions about this invoice, please don't hesitate to contact us.</p>

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Zaytrix Flow - Invoice Management</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: overdueInvoices, error: fetchError } = await supabase
      .from('invoices')
      .select('*')
      .in('status', ['unpaid', 'pending'])
      .lt('due_date', today.toISOString());

    if (fetchError) {
      throw fetchError;
    }

    if (!overdueInvoices || overdueInvoices.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No overdue invoices found', count: 0 }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const results = [];

    for (const invoice of overdueInvoices) {
      const dueDate = new Date(invoice.due_date);
      const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

      const lastReminder = await supabase
        .from('email_logs')
        .select('sent_at')
        .eq('invoice_id', invoice.id)
        .eq('status', 'sent')
        .order('sent_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastReminder.data) {
        const lastReminderDate = new Date(lastReminder.data.sent_at);
        const daysSinceLastReminder = Math.floor((today.getTime() - lastReminderDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceLastReminder < 3) {
          continue;
        }
      }

      const subject = `Payment Reminder: Invoice ${invoice.invoice_number} - ${daysOverdue} Days Overdue`;
      const html = generateReminderEmail(invoice, daysOverdue);

      const emailPayload = {
        from: 'Zaytrix Flow <invoices@zaytrixflow.com>',
        to: [invoice.client_email],
        subject,
        html,
      };

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify(emailPayload),
      });

      const resendData = await resendResponse.json();

      if (resendResponse.ok) {
        await supabase.from('email_logs').insert({
          user_id: invoice.user_id,
          invoice_id: invoice.id,
          recipient_email: invoice.client_email,
          subject,
          body: html,
          status: 'sent',
          sent_at: new Date().toISOString(),
          metadata: { resend_id: resendData.id, reminder_type: 'overdue', days_overdue: daysOverdue },
        });

        await supabase.from('notifications').insert({
          user_id: invoice.user_id,
          type: 'reminder_sent',
          title: 'Reminder Sent',
          message: `Overdue reminder sent for invoice ${invoice.invoice_number}`,
          link: `/dashboard/invoices`,
          metadata: { invoice_id: invoice.id, days_overdue: daysOverdue },
        });

        results.push({ invoice_id: invoice.id, status: 'sent', days_overdue: daysOverdue });
      } else {
        await supabase.from('email_logs').insert({
          user_id: invoice.user_id,
          invoice_id: invoice.id,
          recipient_email: invoice.client_email,
          subject,
          body: html,
          status: 'failed',
          error_message: JSON.stringify(resendData),
        });

        results.push({ invoice_id: invoice.id, status: 'failed', error: resendData });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${results.length} reminders`,
        results,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error sending reminders:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
