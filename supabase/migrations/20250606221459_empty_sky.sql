/*
  # Add line_items column to invoices table

  1. Changes
    - Add `line_items` column of type jsonb to the invoices table
    - This column will store the line items data as JSON
    - Set default value to empty array

  2. Security
    - No changes to RLS policies needed as this is just adding a column
*/

-- Add line_items column to invoices table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'line_items'
  ) THEN
    ALTER TABLE invoices ADD COLUMN line_items jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add index for line_items column for better query performance
CREATE INDEX IF NOT EXISTS idx_invoices_line_items_new ON invoices USING gin (line_items);