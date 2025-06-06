/*
  # Add tax_percentage column to invoices table

  1. Changes
    - Add `tax_percentage` column to `invoices` table
    - Set default value to 0
    - Allow null values for backward compatibility

  2. Notes
    - This column stores the tax percentage applied to invoices
    - Uses DECIMAL type for precise calculations
    - Default value ensures existing invoices work correctly
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'tax_percentage'
  ) THEN
    ALTER TABLE invoices ADD COLUMN tax_percentage DECIMAL(5,2) DEFAULT 0;
  END IF;
END $$;