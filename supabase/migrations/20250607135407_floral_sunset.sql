/*
  # Add missing columns to invoices table

  1. Changes
    - Add `client_id` column (optional foreign key to clients table)
    - Add `line_items` column (JSONB for storing line items)
    - Add `line_items_jsonb` column (backup JSONB column)
    - Add `tax_percentage` column (numeric for tax calculations)

  2. Security
    - Maintains existing RLS policies
    - No changes to existing permissions
*/

-- Add missing columns to invoices table
DO $$
BEGIN
  -- Add client_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'client_id'
  ) THEN
    ALTER TABLE invoices ADD COLUMN client_id uuid REFERENCES clients(id) ON DELETE SET NULL;
  END IF;

  -- Add line_items column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'line_items'
  ) THEN
    ALTER TABLE invoices ADD COLUMN line_items jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Add line_items_jsonb column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'line_items_jsonb'
  ) THEN
    ALTER TABLE invoices ADD COLUMN line_items_jsonb jsonb;
  END IF;

  -- Add tax_percentage column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'tax_percentage'
  ) THEN
    ALTER TABLE invoices ADD COLUMN tax_percentage numeric(5,2) DEFAULT 0;
  END IF;
END $$;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_line_items ON invoices USING gin (line_items_jsonb);
CREATE INDEX IF NOT EXISTS idx_invoices_line_items_new ON invoices USING gin (line_items);