/*
  # Update invoices table to reference clients

  1. Changes
    - Add optional client_id column to invoices table
    - Add foreign key constraint to clients table
    - Keep existing client_name and client_email for backward compatibility
    - Add index for performance

  2. Notes
    - This is a non-breaking change
    - Existing invoices will continue to work
    - New invoices can optionally reference a client record
*/

-- Add client_id column to invoices table
DO $$ BEGIN
    ALTER TABLE invoices ADD COLUMN client_id uuid REFERENCES clients(id) ON DELETE SET NULL;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);

-- Update the line_items column to be JSONB for better performance and querying
DO $$ BEGIN
    ALTER TABLE invoices ADD COLUMN line_items_jsonb jsonb;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Create index on line_items_jsonb for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_line_items ON invoices USING gin(line_items_jsonb);