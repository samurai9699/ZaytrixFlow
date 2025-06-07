/*
  # Add metadata column to user_preferences table

  1. Changes
    - Add `metadata` column to `user_preferences` table
    - Column type: JSONB to store flexible JSON data
    - Default value: empty JSON object '{}'
    - Allow NULL values for existing rows

  2. Purpose
    - Enable storing reminder data and other flexible metadata in user preferences
    - Support the reminder functionality in the application
*/

-- Add metadata column to user_preferences table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;