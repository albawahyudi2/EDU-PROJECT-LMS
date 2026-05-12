-- Fix: Add missing columns to step_submissions table
-- Run this in your Neon/Supabase/Railway PostgreSQL console

ALTER TABLE step_submissions 
  ADD COLUMN IF NOT EXISTS "photoUrls" TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "videoUrl" TEXT;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'step_submissions'
ORDER BY ordinal_position;
