import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  userId: string;
  invoiceId?: string;
  attachments?: Array<{
    filename: string;
    content: string;
  }>;
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

    const { to, subject, html, userId, invoiceId, attachments }: EmailRequest = await req.json();

    if (!to || !subject || !html || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, html, userId' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const emailPayload: any = {
      from: 'Zaytrix Flow <invoices@zaytrixflow.com>',
      to: [to],
      subject,
      html,
    };

    if (attachments && attachments.length > 0) {
      emailPayload.attachments = attachments;
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      await supabase.from('email_logs').insert({
        user_id: userId,
        invoice_id: invoiceId || null,
        recipient_email: to,
        subject,
        body: html,
        status: 'failed',
        error_message: JSON.stringify(resendData),
      });

      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: resendData }),
        {
          status: resendResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    await supabase.from('email_logs').insert({
      user_id: userId,
      invoice_id: invoiceId || null,
      recipient_email: to,
      subject,
      body: html,
      status: 'sent',
      sent_at: new Date().toISOString(),
      metadata: { resend_id: resendData.id },
    });

    if (invoiceId) {
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'invoice_sent',
        title: 'Invoice Sent',
        message: `Invoice sent successfully to ${to}`,
        link: `/dashboard/invoices`,
        metadata: { invoice_id: invoiceId },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        emailId: resendData.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
