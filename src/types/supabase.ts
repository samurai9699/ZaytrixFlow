/**
 * [TEMPORARY INFERRED TYPES]
 * These types were manually inferred from SQL migrations and existing TypeScript usages 
 * because the Supabase CLI type generator was unavailable (Docker daemon not running).
 * 
 * TODO: Replace this entire file with the auto-generated types from Supabase CLI once Docker is running:
 * `npx supabase gen types typescript --local > src/types/supabase.ts`
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string | null // Marked as unknown if unclear
          plan_type: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
          plan_type?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
          plan_type?: string | null
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          company: string | null
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          company?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          company?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          client_id: string | null
          client_name: string
          client_email: string
          invoice_number: string
          amount: number
          currency: string
          status: 'draft' | 'unpaid' | 'pending' | 'upcoming' | 'paid'
          issue_date: string
          due_date: string
          paid_date: string | null
          description: string | null
          line_items: Json | null
          tax_percentage: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          client_id?: string | null
          client_name: string
          client_email: string
          invoice_number: string
          amount: number
          currency?: string
          status?: 'draft' | 'unpaid' | 'pending' | 'upcoming' | 'paid'
          issue_date: string
          due_date: string
          paid_date?: string | null
          description?: string | null
          line_items?: Json | null
          tax_percentage?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string | null
          client_name?: string
          client_email?: string
          invoice_number?: string
          amount?: number
          currency?: string
          status?: 'draft' | 'unpaid' | 'pending' | 'upcoming' | 'paid'
          issue_date?: string
          due_date?: string
          paid_date?: string | null
          description?: string | null
          line_items?: Json | null
          tax_percentage?: number | null
          created_at?: string
          updated_at?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          is_read: boolean
          link: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          is_read?: boolean
          link?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          is_read?: boolean
          link?: string | null
          created_at?: string
        }
      }
      email_logs: {
        Row: {
          id: string
          user_id: string
          recipient_email: string
          subject: string
          status: string
          invoice_id: string | null
          created_at: string
          error_message: string | null
        }
        Insert: {
          id?: string
          user_id: string
          recipient_email: string
          subject: string
          status: string
          invoice_id?: string | null
          created_at?: string
          error_message?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          recipient_email?: string
          subject?: string
          status?: string
          invoice_id?: string | null
          created_at?: string
          error_message?: string | null
        }
      }
      filter_presets: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          filters: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          filters: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          filters?: Json
          created_at?: string
        }
      }
      reminder_templates: {
        Row: {
          id: string
          user_id: string
          name: string
          subject: string
          body: string
          days_offset: number
          type: string
          is_active: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          subject: string
          body: string
          days_offset: number
          type: string
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          subject?: string
          body?: string
          days_offset?: number
          type?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      integrations: {
        Row: {
          id: string
          user_id: string
          provider: string
          access_token: string | null
          refresh_token: string | null
          is_active: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          provider: string
          access_token?: string | null
          refresh_token?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          provider?: string
          access_token?: string | null
          refresh_token?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      api_keys: {
        Row: {
          id: string
          user_id: string
          name: string
          key: string
          last_used: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          key: string
          last_used?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          key?: string
          last_used?: string | null
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          preferences: Json
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          preferences?: Json
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          preferences?: Json
          created_at?: string
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
