import { createClient } from '@supabase/supabase-js';
import { loadEnvConfig } from '@next/env';
import fs from 'fs';
import path from 'path';

// Load .env.local
const projectDir = process.cwd();
loadEnvConfig(projectDir);

// 1. Get credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use anon key, since we temporarily granted insert to anon
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local!");
  process.exit(1);
}

console.log("Using URL:", supabaseUrl);
console.log("Using Key starts with:", supabaseKey.substring(0, 10));

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSeed() {
  console.log("Loading seed products from src/data/seedProducts.ts...");
  
  // Note: Since this is a one-off JS script run via Node, 
  // we would compile the seedProducts file or just copy the JSON array here.
  // For simplicity, we are dynamically importing it (assuming tsx or similar runner).
  const { seedProducts } = await import('../src/data/seedProducts.ts');
  
  console.log(`Found ${seedProducts.length} products to import.`);

  let successCount = 0;
  let errorCount = 0;

  for (const product of seedProducts) {
    console.log(`Importing: ${product.name}...`);
    
    // Convert array structure to what Supabase expects (UUID id is auto-generated)
    const { error } = await supabase.from('products').insert([{
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      category: product.category,
      sizes: product.sizes,
      colors: product.colors,
      images: product.images,
      material: product.material,
      featured: product.featured,
      "newArrival": product.newArrival
    }]);

    if (error) {
      console.error(`❌ Failed to insert ${product.name}:`, error.message);
      errorCount++;
    } else {
      console.log(`✅ Success: ${product.name}`);
      successCount++;
    }
  }

  console.log("-----------------------------------------");
  console.log(`Import Complete! Successfully imported ${successCount} products. Errors: ${errorCount}`);
}

runSeed();
