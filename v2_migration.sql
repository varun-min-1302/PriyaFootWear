-- Supabase Migration Script for Priya Footwear V2

-- 1. Create product_status ENUM
CREATE TYPE public.product_status AS ENUM ('published', 'draft', 'archived', 'coming_soon');

-- 2. Update products table with new columns
ALTER TABLE public.products 
  ADD COLUMN original_price NUMERIC,
  ADD COLUMN enquiry_count INTEGER DEFAULT 0 NOT NULL,
  ADD COLUMN share_count INTEGER DEFAULT 0 NOT NULL,
  ADD COLUMN view_count INTEGER DEFAULT 0 NOT NULL,
  ADD COLUMN status public.product_status DEFAULT 'published' NOT NULL;

-- 3. Create activity_logs table
CREATE TABLE public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  details JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable RLS on activity_logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies for activity_logs
-- Only admins can read activity logs
CREATE POLICY "Admins can read activity logs" ON public.activity_logs
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

-- Only admins can insert activity logs
CREATE POLICY "Admins can insert activity logs" ON public.activity_logs
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

-- No update/delete policies for logs (immutable audit trail)

-- 6. Update products RLS to allow reading only 'published' products for non-admins, but all products for admins
-- Drop the existing permissive read policy
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;

-- Create new conditional read policy
CREATE POLICY "Enable read access for all users" ON public.products
  FOR SELECT USING (
    status = 'published' 
    OR 
    (auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
  );
