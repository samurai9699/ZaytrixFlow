/*
  # Add user registration policy
  
  1. Changes
    - Add RLS policy to allow users to insert their own profile during registration
  
  2. Security
    - Policy ensures users can only insert a row with their own auth.uid()
    - Maintains existing RLS policies for SELECT and UPDATE
*/

CREATE POLICY "Users can insert own profile" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() = id);