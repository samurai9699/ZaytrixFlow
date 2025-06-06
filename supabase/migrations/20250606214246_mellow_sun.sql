/*
  # Create invoices table for ZaytrixFlow

  1. New Tables
    - `invoices`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `client_name` (text)
      - `client_email` (text)
      - `invoice_number` (text, unique)
      - `amount` (decimal)
      - `currency` (text, default 'USD')
      - `status` (enum: unpaid, pending, upcoming, paid)
      - `issue_date` (date)
      - `due_date` (date)
      - `paid_date` (date, nullable)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `invoices` table
    - Add policies for authenticated users to manage their own invoices

  3. Indexes
    - Add indexes for performance on user_id, status, and due_date
*/

-- Create invoice status enum
CREATE TYPE invoice_status AS ENUM ('unpaid', 'pending', 'upcoming', 'paid');

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  invoice_number text UNIQUE NOT NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD' NOT NULL,
  status invoice_status DEFAULT 'upcoming' NOT NULL,
  issue_date date NOT NULL,
  due_date date NOT NULL,
  paid_date date,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own invoices"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoices"
  ON invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices"
  ON invoices
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices"
  ON invoices
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_invoices_updated_at();

-- Insert sample data for demonstration
INSERT INTO invoices (user_id, client_name, client_email, invoice_number, amount, status, issue_date, due_date, description) VALUES
  -- You'll need to replace these user_ids with actual user IDs from your auth.users table
  (gen_random_uuid(), 'Acme Corporation', 'billing@acme.com', 'INV-2025-001', 2500.00, 'unpaid', '2025-01-15', '2025-02-15', 'Website redesign project'),
  (gen_random_uuid(), 'TechStart Inc', 'finance@techstart.com', 'INV-2025-002', 1800.00, 'pending', '2025-02-01', '2025-03-01', 'Mobile app development'),
  (gen_random_uuid(), 'Design Studio', 'accounts@designstudio.com', 'INV-2025-003', 950.00, 'paid', '2025-01-01', '2025-01-31', 'Logo design and branding'),
  (gen_random_uuid(), 'Global Services', 'billing@globalservices.com', 'INV-2025-004', 3200.00, 'upcoming', '2025-03-01', '2025-03-31', 'E-commerce platform development'),
  (gen_random_uuid(), 'Local Business', 'owner@localbiz.com', 'INV-2025-005', 750.00, 'unpaid', '2025-01-20', '2025-02-20', 'SEO optimization services'),
  (gen_random_uuid(), 'Startup Co', 'finance@startup.co', 'INV-2025-006', 4500.00, 'paid', '2025-12-15', '2025-01-15', 'Full-stack web application');