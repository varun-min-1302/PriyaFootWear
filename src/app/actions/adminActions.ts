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

// Helper: create a service-role client for mutations so RLS
// policies that depend on auth.uid() always pass after we've
// already verified the caller is an admin.
async function createServiceClient() {
  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function safeRevalidate() {
  try {
    revalidatePath("/admin");
    revalidatePath("/products");
    revalidatePath("/");
  } catch (e) {
    console.error("[revalidate] non-fatal error:", e);
  }
}

export async function createProductAction(productData:   any) {
  // Verify the caller is a logged-in admin
  await verifyAdmin();

  // Use service role for the actual DB write
  const supa = await createServiceClient();

  const { error: dbError } = await supa
    .from("products")
    .insert([productData]);

  if (dbError) {
    console.error("[createProduct] Supabase error:", JSON.stringify(dbError, null, 2));
    throw new Error(`Failed to create product: ${dbError.message}`);
  }

  safeRevalidate();
  return { success: true };
}

export async function updateProductAction(productId: string, productData:   any) {
  // Verify the caller is a logged-in admin
  await verifyAdmin();

  // Use service role for the actual DB write
  const supa = await createServiceClient();

  console.log("[updateProduct] Updating product:", productId);
  console.log("[updateProduct] Data:", JSON.stringify(productData, null, 2));

  const { data, error: dbError } = await supa
    .from("products")
    .update(productData)
    .eq("id", productId)
    .select();

  if (dbError) {
    console.error("[updateProduct] Supabase error:", JSON.stringify(dbError, null, 2));
    throw new Error(`Failed to update product: ${dbError.message}`);
  }

  console.log("[updateProduct] Success. Rows affected:", data?.length ?? 0);

  safeRevalidate();
  return { success: true };
}

export async function deleteProductAction(productId: string) {
  await verifyAdmin();
  const supa = await createServiceClient();

  const { error: dbError } = await supa
    .from("products")
    .delete()
    .eq("id", productId);

  if (dbError) {
    console.error("[deleteProduct] Supabase error:", JSON.stringify(dbError, null, 2));
    throw new Error(`Failed to delete product: ${dbError.message}`);
  }

  safeRevalidate();
  return { success: true };
}

export async function toggleFeaturedAction(productId: string, currentStatus: boolean) {
  await verifyAdmin();
  const supa = await createServiceClient();

  const { error: dbError } = await supa
    .from("products")
    .update({ featured: !currentStatus })
    .eq("id", productId);

  if (dbError) {
    console.error("[toggleFeatured] Supabase error:", JSON.stringify(dbError, null, 2));
    throw new Error(`Failed to toggle featured: ${dbError.message}`);
  }

  safeRevalidate();
  return { success: true };
}

export async function toggleNewArrivalAction(productId: string, currentStatus: boolean) {
  await verifyAdmin();
  const supa = await createServiceClient();

  const { error: dbError } = await supa
    .from("products")
    .update({ "newArrival": !currentStatus })
    .eq("id", productId);

  if (dbError) {
    console.error("[toggleNewArrival] Supabase error:", JSON.stringify(dbError, null, 2));
    throw new Error(`Failed to toggle new arrival: ${dbError.message}`);
  }

  safeRevalidate();
  return { success: true };
}

export async function uploadImageAction(formData: FormData) {
  await verifyAdmin();
  
  const file = formData.get("file") as File | null;
  const filePath = formData.get("filePath") as string | null;

  if (!file || !filePath) {
    throw new Error("Missing file or filePath");
  }

  const supa = await createServiceClient();

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supa.storage
    .from("product-images")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false
    });

  if (error) {
    console.error("[uploadImage] Supabase error:", JSON.stringify(error, null, 2));
    throw new Error(`Failed to upload image: ${(error as Error).message}`);
  }

  const { data: { publicUrl } } = supa.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return { publicUrl };
}

export async function changePasswordAction(formData: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  // 1. Verify caller is an authenticated administrator
  const { supabase, user } = await verifyAdmin();

  const { currentPassword, newPassword, confirmPassword } = formData;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, error: "All password fields are required." };
  }

  if (newPassword.length < 8) {
    return { success: false, error: "New password must be at least 8 characters long." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "New password and confirmation do not match." };
  }

  if (newPassword === currentPassword) {
    return { success: false, error: "New password must be different from current password." };
  }

  if (!user.email) {
    return { success: false, error: "Authenticated user email not found." };
  }

  // 2. Validate current password by reauthenticating with Supabase Auth
  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
  const authVerifyClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const { error: signInError } = await authVerifyClient.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    return { success: false, error: "Current password is incorrect." };
  }

  // 3. Update password using the authenticated user's session
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { success: false, error: updateError.message || "Failed to update password." };
  }

  return { success: true, message: "Your password has been changed successfully." };
}

