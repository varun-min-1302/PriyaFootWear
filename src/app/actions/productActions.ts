"use server";

import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types/product";

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids || ids.length === 0) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .in("id", ids);

  if (error) {
    console.error("Error fetching products by ids:", error.message);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: Number(row.price),
    category: row.category as any,
    sizes: row.sizes || [],
    colors: row.colors || [],
    images: row.images || [],
    material: row.material,
    featured: row.featured,
    newArrival: row.newArrival,
    original_price: row.original_price ? Number(row.original_price) : undefined,
    enquiry_count: row.enquiry_count,
    share_count: row.share_count,
    view_count: row.view_count,
    status: row.status as any,
    createdAt: row.createdAt || row.created_at,
  }));
}

export async function recordProductView(id: string) {
  if (!id) return;
  const supabase = await createClient();
  
  // Call an RPC if it existed, but since we don't have an RPC for increment, 
  // we must read then update. (This can have race conditions but is fine for simple view counts).
  // A better way is using a Supabase Postgres function for atomic increment, but let's do simple read/write for now or just skip if we can't reliably increment without an RPC.
  // Wait, we can just do this:
  const { data } = await supabase.from("products").select("view_count").eq("id", id).single();
  if (data) {
    await supabase.from("products").update({ view_count: (data.view_count || 0) + 1 }).eq("id", id);
  }
}

export async function recordProductShare(id: string) {
  if (!id) return;
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("share_count").eq("id", id).single();
  if (data) {
    await supabase.from("products").update({ share_count: (data.share_count || 0) + 1 }).eq("id", id);
  }
}

export async function recordProductEnquiry(id: string) {
  if (!id) return;
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("enquiry_count").eq("id", id).single();
  if (data) {
    await supabase.from("products").update({ enquiry_count: (data.enquiry_count || 0) + 1 }).eq("id", id);
  }
}

