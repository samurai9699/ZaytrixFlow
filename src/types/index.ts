import { Database } from './supabase';

/**
 * [TEMPORARY INFERRED TYPES]
 * Central exported types. These map to the manually inferred Database types.
 */
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Database Entities
export type UserRow = Tables<'users'>;
export type Client = Tables<'clients'>;
export type Invoice = Tables<'invoices'>;
export type NotificationItem = Tables<'notifications'>;
export type EmailLog = Tables<'email_logs'>;
export type FilterPreset = Tables<'filter_presets'>;
export type ReminderTemplate = Tables<'reminder_templates'>;
export type Integration = Tables<'integrations'>;
export type ApiKey = Tables<'api_keys'>;
export type UserPreference = Tables<'user_preferences'>;

/**
 * Common Component Structures
 */

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface ChartTickProps {
  x: number;
  y: number;
  payload: {
    value: string;
  };
}

export interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

// Ensure proper extending for additional ad-hoc states in UI
export interface ClientWithStats extends Client {
  total_invoices?: number;
  total_amount?: number;
  last_invoice_date?: string | null;
}
