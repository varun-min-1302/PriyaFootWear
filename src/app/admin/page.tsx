"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { Plus, Pencil, Trash2, Star, Sparkles, X, ShieldAlert, Archive, Lock, Phone, Eye, EyeOff, LogIn, LogOut, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { createProductAction, updateProductAction, deleteProductAction, toggleFeaturedAction, toggleNewArrivalAction } from "@/app/actions/adminActions";

export default function AdminDashboard() {
  const supabase = createClient();

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Check Session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        fetchProducts();
      }
      setIsLoggingIn(false);
    };
    checkSession();
  }, []);

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) {
      const formatted: Product[] = data.map(row => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        price: Number(row.price),
        category: row.category,
        sizes: row.sizes || [],
        colors: row.colors || [],
        images: row.images || [],
        material: row.material,
        featured: row.featured,
        newArrival: row.newArrival,
        createdAt: row.created_at || row.createdAt,
      }));
      setProducts(formatted);
    }
    setIsLoadingProducts(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    const cleanPhone = phone.replace(/\D/g, "");
    const mappedEmail = `${cleanPhone}@admin.com`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: mappedEmail,
      password: password,
    });

    if (error) {
      setLoginError("Invalid mobile number or security password.");
    } else if (data.session) {
      setIsLoggedIn(true);
      fetchProducts();
    }
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  // Dialog / Modal Visibility States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields State
  const [name, setName] = useState("");
  const [price, setPrice] = useState(1999);
  const [category, setCategory] = useState<"Formal" | "Casual" | "Sports" | "Sandals" | "Slippers" | "Belts">("Casual");
  const [material, setMaterial] = useState("");
  const [description, setDescription] = useState("");
  const [sizesInput, setSizesInput] = useState("7, 8, 9, 10, 11");
  const [colorsInput, setColorsInput] = useState("Black, Brown");
  const [imageUrls, setImageUrls] = useState("");
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(false);

  // Stats calculation
  const totalProducts = products.length;
  const featuredCount = products.filter((p) => p.featured).length;
  const newArrivalsCount = products.filter((p) => p.newArrival).length;

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category as any);
    setMaterial(product.material || "");
    setDescription(product.description);
    setSizesInput(product.sizes.join(", "));
    setColorsInput(product.colors.join(", "));
    setImageUrls(product.images.join(", "));
    setUploadFiles([]);
    setFeatured(product.featured);
    setNewArrival(product.newArrival);
    setIsEditOpen(true);
  };

  const uploadImagesIfPresent = async (): Promise<string[]> => {
    if (uploadFiles.length === 0) return [];
    
    const uploadedUrls: string[] = [];
    for (const file of uploadFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error", uploadError);
        throw new Error(`Image upload failed: ${uploadError.message}. Make sure your account has admin permissions.`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }
    return uploadedUrls;
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);

    try {
      const uploadedUrls = await uploadImagesIfPresent();
      
      let finalImageUrls = uploadedUrls.length > 0 
        ? uploadedUrls 
        : imageUrls.split(",").map(url => url.trim()).filter(url => url && !url.startsWith("blob:"));

      if (finalImageUrls.length === 0) {
        finalImageUrls = ["https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800"];
      }

      const sizes = sizesInput.split(",").map((s) => s.trim()).filter(Boolean);
      const colors = colorsInput.split(",").map((c) => c.trim()).filter(Boolean);
      const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "") + "-" + Math.random().toString(36).substring(2,6);

      const productData = {
        name: name.trim(),
        slug,
        price: Number(price) || 0,
        category,
        material: material.trim() || null,
        description: description.trim(),
        sizes,
        colors,
        images: finalImageUrls,
        featured,
        "newArrival": newArrival,
      };

      await createProductAction(productData);
      await fetchProducts();
      resetForm();
      setIsAddOpen(false);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error adding product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !name.trim()) return;
    setIsSubmitting(true);

    try {
      const uploadedUrls = await uploadImagesIfPresent();
      
      let finalImageUrls = uploadedUrls.length > 0 
        ? uploadedUrls 
        : imageUrls.split(",").map(url => url.trim()).filter(url => url && !url.startsWith("blob:"));
        
      if (finalImageUrls.length === 0 && editingProduct.images.length > 0) {
        finalImageUrls = editingProduct.images;
      } else if (finalImageUrls.length === 0) {
        finalImageUrls = ["https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800"];
      }

      const sizes = sizesInput.split(",").map((s) => s.trim()).filter(Boolean);
      const colors = colorsInput.split(",").map((c) => c.trim()).filter(Boolean);

      const productData = {
        name: name.trim(),
        price: Number(price) || 0,
        category,
        material: material.trim() || null,
        description: description.trim(),
        sizes,
        colors,
        images: finalImageUrls,
        featured,
        "newArrival": newArrival,
      };

      await updateProductAction(editingProduct.id, productData);
      await fetchProducts();
      resetForm();
      setIsEditOpen(false);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error updating product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    try {
      await deleteProductAction(id);
      await fetchProducts();
    } catch (err: any) {
      alert(err.message || "Error deleting product");
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      await toggleFeaturedAction(id, current);
      await fetchProducts();
    } catch (err: any) {
      alert(err.message || "Error toggling featured");
    }
  };

  const toggleNewArrival = async (id: string, current: boolean) => {
    try {
      await toggleNewArrivalAction(id, current);
      await fetchProducts();
    } catch (err: any) {
      alert(err.message || "Error toggling new arrival");
    }
  };

  const resetForm = () => {
    setName("");
    setPrice(1999);
    setCategory("Casual");
    setMaterial("");
    setDescription("");
    setSizesInput("7, 8, 9, 10, 11");
    setColorsInput("Black, Brown");
    setImageUrls("");
    setUploadFiles([]);
    setFeatured(false);
    setNewArrival(false);
    setEditingProduct(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden px-4 py-12">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="flex flex-col items-center text-center mb-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-accent/30 flex items-center justify-center p-3 shadow-lg shadow-accent/5">
              <Image 
                src="/images/logo.svg" 
                alt="Priya Foot Wear" 
                width={40} 
                height={40} 
                className="w-auto h-auto"
              />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-extrabold tracking-[0.3em] uppercase text-accent">
                Staff Secure Access
              </span>
              <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-foreground">
                Priya Footwear
              </h2>
              <p className="text-[11px] text-muted-foreground font-medium">
                Enter your credentials to manage inventory and catalog settings.
              </p>
            </div>
          </div>

          <div className="bg-card/60 backdrop-blur-xl border border-accent/20 rounded-2xl p-8 shadow-2xl shadow-black/10 dark:shadow-black/80 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" />

            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">
                  Registered Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="Enter 10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/60 text-foreground transition-all duration-300 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">
                    Security Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter staff security key"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3.5 bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/60 text-foreground transition-all duration-300 font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-accent transition-colors duration-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-4 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md shadow-accent/10 hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoggingIn ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Authenticating...</>
                ) : (
                  <><LogIn className="h-4 w-4" /> Sign In to Console</>
                )}
              </button>
            </form>
          </div>

          <div className="flex justify-center mt-8">
            <Link href="/" className="text-neutral-500 hover:text-accent text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 flex items-center gap-1.5">
              ← Back to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-accent" />
            <div>
              <h1 className="text-3xl font-display font-black tracking-tight uppercase">Admin Panel</h1>
              <p className="text-xs text-muted-foreground font-semibold">Manage shoe inventory, pricing, featured collections, and catalog details.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                resetForm();
                setIsAddOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-foreground text-background font-bold text-xs uppercase tracking-widest hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-md shadow-accent/5 cursor-pointer"
            >
              <Plus className="h-4.5 w-4.5" />
              Add Footwear
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-red-500/20 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500/10 transition-all duration-300 shadow-sm cursor-pointer"
            >
              <LogOut className="h-4.5 w-4.5" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border/40 flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Total Collection</span>
              <p className="text-3xl font-black mt-1">{totalProducts} Items</p>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300">
              <Archive className="h-5 w-5" />
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border/40 flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Featured Treads</span>
              <p className="text-3xl font-black mt-1">{featuredCount} Models</p>
            </div>
            <div className="p-3.5 rounded-xl bg-yellow-500/10 text-yellow-500">
              <Star className="h-5 w-5 fill-current" />
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border/40 flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">New Arrivals</span>
              <p className="text-3xl font-black mt-1">{newArrivalsCount} Shoes</p>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-500">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border/40 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-border/40 flex items-center justify-between">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground">
              Inventory Catalog ({products.length})
            </h3>
          </div>
          
          <div className="w-full">
            {isLoadingProducts ? (
              <div className="text-center py-16 text-muted-foreground font-semibold flex justify-center"><Loader2 className="animate-spin" /></div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground font-semibold">No items in database.</div>
            ) : (
              <>
                {/* Mobile Cards View */}
                <div className="md:hidden divide-y divide-border/30">
                  {products.map((p) => (
                    <div key={p.id} className="p-4 flex flex-col gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-900/10 transition-colors">
                      <div className="flex gap-4 items-center">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-border/40 shrink-0">
                          <Image src={p.images[0] || "/placeholder.jpg"} alt={p.name} fill className="object-contain p-1" sizes="64px" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm leading-tight text-foreground">{p.name}</p>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">ID: {p.id}</p>
                          <p className="text-xs font-semibold mt-1">{p.category} • ₹{p.price}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex gap-2">
                          <button onClick={() => toggleFeatured(p.id, p.featured)} className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border transition-all ${p.featured ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-500" : "border-border/50 text-muted-foreground"}`}>
                            <Star className="h-3 w-3 fill-current" /> Featured
                          </button>
                          <button onClick={() => toggleNewArrival(p.id, p.newArrival)} className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border transition-all ${p.newArrival ? "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-500" : "border-border/50 text-muted-foreground"}`}>
                            <Sparkles className="h-3 w-3" /> New
                          </button>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEditClick(p)} className="p-2 rounded-lg border border-border/80 text-muted-foreground hover:text-accent">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => deleteProduct(p.id)} className="p-2 rounded-lg border border-border/80 text-muted-foreground hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/30 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/20">
                        <th className="py-4 px-6">Product</th>
                        <th className="py-4 px-6">Category</th>
                        <th className="py-4 px-6">Price</th>
                        <th className="py-4 px-6">Status Details</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/10 transition-colors duration-200">
                          <td className="py-4 px-6 flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-border/40 shrink-0">
                              <Image src={p.images[0] || "/placeholder.jpg"} alt={p.name} fill className="object-contain p-1" sizes="48px" />
                            </div>
                            <div>
                              <p className="font-bold text-sm leading-tight text-foreground line-clamp-1">{p.name}</p>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-0.5 truncate w-32">ID: {p.id}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm font-semibold">{p.category}</td>
                          <td className="py-4 px-6 text-sm font-bold">₹{p.price}</td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2">
                              <button
                                onClick={() => toggleFeatured(p.id, p.featured)}
                                className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full border transition-all ${
                                  p.featured ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-500" : "border-border/50 text-muted-foreground"
                                }`}
                              >
                                <Star className="h-3 w-3 fill-current" /> Featured
                              </button>
                              <button
                                onClick={() => toggleNewArrival(p.id, p.newArrival)}
                                className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full border transition-all ${
                                  p.newArrival ? "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-500" : "border-border/50 text-muted-foreground"
                                }`}
                              >
                                <Sparkles className="h-3 w-3" /> New
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2.5">
                              <button onClick={() => handleEditClick(p)} className="p-2 rounded-lg border border-border/80 text-muted-foreground hover:text-accent">
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button onClick={() => deleteProduct(p.id)} className="p-2 rounded-lg border border-border/80 text-muted-foreground hover:text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Modal: ADD / EDIT DIALOG FORM SHEET */}
        {(isAddOpen || isEditOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => {
                if (!isSubmitting) {
                  setIsAddOpen(false);
                  setIsEditOpen(false);
                  resetForm();
                }
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <div className="relative bg-card border border-border/40 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden z-10 shadow-2xl">
              <div className="px-6 py-5 border-b border-border/40 flex justify-between items-center">
                <h3 className="font-display font-black text-xl uppercase tracking-wide">
                  {isEditOpen ? "Edit Footwear Item" : "Add New Footwear"}
                </h3>
                <button
                  disabled={isSubmitting}
                  onClick={() => {
                    setIsAddOpen(false);
                    setIsEditOpen(false);
                    resetForm();
                  }}
                  className="p-1.5 rounded-full bg-muted/60 text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={isEditOpen ? handleEditSubmit : handleAddSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-extrabold block">Shoe Name</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Aurelius Oxford" className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-border/50 rounded-xl text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-extrabold block">Price (INR)</label>
                    <input type="number" required min={0} value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)} className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-border/50 rounded-xl text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-extrabold block">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-border/50 rounded-xl text-sm">
                      <option value="Formal">Formal Shoes</option>
                      <option value="Casual">Casual Shoes</option>
                      <option value="Sports">Sports Shoes</option>
                      <option value="Sandals">Sandals</option>
                      <option value="Slippers">Slippers</option>
                      <option value="Belts">Belts</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-extrabold block">Material Details</label>
                    <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="e.g., Italian Leather" className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-border/50 rounded-xl text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-extrabold block">Description</label>
                  <textarea rows={3} required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-border/50 rounded-xl text-sm resize-none" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-extrabold block">Sizes (Comma Separated)</label>
                    <input type="text" required value={sizesInput} onChange={(e) => setSizesInput(e.target.value)} className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-border/50 rounded-xl text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-extrabold block">Colors (Comma Separated)</label>
                    <input type="text" required value={colorsInput} onChange={(e) => setColorsInput(e.target.value)} className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-border/50 rounded-xl text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-extrabold block">Product Image</label>
                  <div className="flex gap-3 items-center">
                    <label className="flex-shrink-0 px-4 py-3 bg-neutral-200 dark:bg-neutral-800 text-xs font-bold uppercase rounded-xl cursor-pointer">
                      <span>Upload Files</span>
                      <input 
                        type="file" multiple accept="image/*" className="hidden" 
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length > 0) {
                            setUploadFiles(files);
                            setImageUrls(files.map(f => URL.createObjectURL(f)).join(", "));
                          }
                        }}
                      />
                    </label>
                    <span className="text-xs">OR</span>
                    <input type="text" value={imageUrls} onChange={(e) => setImageUrls(e.target.value)} placeholder="Comma separated URLs..." className="flex-grow px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-border/50 rounded-xl text-sm" />
                  </div>
                </div>

                <div className="flex gap-6 items-center pt-2">
                  <label className="flex items-center gap-2.5 text-sm font-semibold cursor-pointer">
                    <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4" /> Featured
                  </label>
                  <label className="flex items-center gap-2.5 text-sm font-semibold cursor-pointer">
                    <input type="checkbox" checked={newArrival} onChange={(e) => setNewArrival(e.target.checked)} className="w-4 h-4" /> New Arrival
                  </label>
                </div>

                <div className="pt-6 border-t border-border/40 flex justify-end gap-3">
                  <button type="button" disabled={isSubmitting} onClick={() => { setIsAddOpen(false); setIsEditOpen(false); resetForm(); }} className="px-5 py-3 rounded-xl border border-border/80 text-xs uppercase font-bold text-muted-foreground">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-6 py-3 rounded-xl bg-accent text-accent-foreground font-extrabold text-xs uppercase shadow-md disabled:opacity-50 flex items-center gap-2">
                    {isSubmitting && <Loader2 className="animate-spin h-4 w-4" />}
                    {isEditOpen ? "Save Changes" : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
