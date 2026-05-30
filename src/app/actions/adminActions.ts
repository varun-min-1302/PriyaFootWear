"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Helper to verify admin session
async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error("Unauthorized: Invalid session.");
  }
  
  return { supabase, user };
}

export async function createProductAction(productData: any) {
  const { supabase } = await verifyAdmin();

  const { error: dbError } = await supabase
    .from("products")
    .insert([productData]);

  if (dbError) {
    console.error("[Security] Failed to create product:", dbError.message);
    throw new Error("Forbidden: You do not have permission to perform this action.");
  }

  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function updateProductAction(productId: string, productData: any) {
  const { supabase } = await verifyAdmin();

  const { error: dbError } = await supabase
    .from("products")
    .update(productData)
    .eq("id", productId);

  if (dbError) {
    console.error(`[Security] Failed to update product ${productId}:`, dbError.message);
    throw new Error("Forbidden: You do not have permission to perform this action.");
  }

  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath(`/products/${productData.slug}`);
  revalidatePath("/");
  return { success: true };
}

export async function deleteProductAction(productId: string) {
  const { supabase } = await verifyAdmin();

  const { error: dbError } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (dbError) {
    console.error(`[Security] Failed to delete product ${productId}:`, dbError.message);
    throw new Error("Forbidden: You do not have permission to perform this action.");
  }

  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function toggleFeaturedAction(productId: string, currentStatus: boolean) {
  const { supabase } = await verifyAdmin();

  const { error: dbError } = await supabase
    .from("products")
    .update({ featured: !currentStatus })
    .eq("id", productId);

  if (dbError) {
    console.error(`[Security] Failed to toggle featured for ${productId}:`, dbError.message);
    throw new Error("Forbidden: You do not have permission to perform this action.");
  }

  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function toggleNewArrivalAction(productId: string, currentStatus: boolean) {
  const { supabase } = await verifyAdmin();

  const { error: dbError } = await supabase
    .from("products")
    .update({ "newArrival": !currentStatus })
    .eq("id", productId);

  if (dbError) {
    console.error(`[Security] Failed to toggle newArrival for ${productId}:`, dbError.message);
    throw new Error("Forbidden: You do not have permission to perform this action.");
  }

  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}
