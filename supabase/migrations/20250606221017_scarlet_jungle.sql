/*
  # Create clients table for invoice management

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, client name)
      - `email` (text, client email)
      - `company` (text, optional company name)
      - `phone` (text, optional phone number)
      - `address` (text, optional address)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `clients` table
    - Add policies for authenticated users to manage their own clients

  3. Indexes
    - Add indexes for performance on user_id and email
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  company text,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ BEGIN
    CREATE POLICY "Users can view their own clients"
      ON clients
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert their own clients"
      ON clients
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update their own clients"
      ON clients
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can delete their own clients"
      ON clients
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_clients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ BEGIN
    CREATE TRIGGER update_clients_updated_at
        BEFORE UPDATE ON clients
        FOR EACH ROW
        EXECUTE FUNCTION update_clients_updated_at();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add some sample clients for demonstration (optional)
-- Note: These will only be visible to the user who creates them
-- You can remove this section if you don't want sample data
INSERT INTO clients (user_id, name, email, company) 
SELECT 
  auth.uid(),
  'Sample Client',
  'client@example.com',
  'Example Company'
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;