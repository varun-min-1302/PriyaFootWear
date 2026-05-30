import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCount() {
  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });
    
  if (error) {
    console.error("Error querying Supabase:", error.message);
  } else {
    console.log(`Supabase Database Count: ${count}`);
  }
}

checkCount();
