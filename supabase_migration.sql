-- Supabase Migration Script for Priya Footwear

-- 1. Create the Products Table
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  sizes JSONB DEFAULT '[]'::JSONB,
  colors JSONB DEFAULT '[]'::JSONB,
  images JSONB DEFAULT '[]'::JSONB,
  material TEXT,
  featured BOOLEAN DEFAULT false,
  "newArrival" BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the Admins lookup table
CREATE TABLE public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for Admins table
CREATE POLICY "Admins can read own record" ON public.admins
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- 5. Create RLS Policies for Products
-- Allow anyone to read products (for the storefront)
CREATE POLICY "Enable read access for all users" ON public.products
  FOR SELECT USING (true);

-- Allow only explicit admins to insert/update/delete products
CREATE POLICY "Enable insert for explicit admins only" ON public.products
  FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

CREATE POLICY "Enable update for explicit admins only" ON public.products
  FOR UPDATE TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

CREATE POLICY "Enable delete for explicit admins only" ON public.products
  FOR DELETE TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

-- 6. Set up Storage for Product Images
-- Create a new public bucket called 'product-images'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Create Storage Policies
-- Allow public to view images
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated admins to upload/update/delete images
CREATE POLICY "Admins can upload images" ON storage.objects
  FOR INSERT TO authenticated 
  WITH CHECK (bucket_id = 'product-images' AND EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

CREATE POLICY "Admins can update images" ON storage.objects
  FOR UPDATE TO authenticated 
  USING (bucket_id = 'product-images' AND EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

CREATE POLICY "Admins can delete images" ON storage.objects
  FOR DELETE TO authenticated 
  USING (bucket_id = 'product-images' AND EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
