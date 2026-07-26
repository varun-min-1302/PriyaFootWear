import { createClient } from "@/lib/supabase/server";
import { TrendingUp, Users, Share2, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AnalyticsDashboard() {
  const supabase = await createClient();

  // Check auth
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return (
      <div className="pt-32 text-center text-muted-foreground font-semibold">
        Access Denied. Please login to the admin panel.
      </div>
    );
  }

  // Fetch products and aggregate stats
  const { data: products } = await supabase
    .from("products")
    .select("id, name, images, view_count, share_count, enquiry_count")
    .order("view_count", { ascending: false });

  const totalViews = products?.reduce((acc, p) => acc + (p.view_count || 0), 0) || 0;
  const totalShares = products?.reduce((acc, p) => acc + (p.share_count || 0), 0) || 0;
  const totalEnquiries = products?.reduce((acc, p) => acc + (p.enquiry_count || 0), 0) || 0;

  // Top 5 products by views
  const topViewed = (products || []).slice(0, 5);
  // Top 5 by enquiries
  const topEnquired = [...(products || [])].sort((a, b) => (b.enquiry_count || 0) - (a.enquiry_count || 0)).slice(0, 5);

  return (
    <div className="pt-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-accent" />
            <div>
              <h1 className="text-3xl font-display font-black tracking-tight uppercase">Analytics Dashboard</h1>
              <p className="text-xs text-muted-foreground font-semibold">Real-time performance metrics and customer engagement tracking.</p>
            </div>
          </div>
          <Link
            href="/admin"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-foreground text-background font-bold text-xs uppercase tracking-widest hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-md shadow-accent/5"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            Back to Inventory
          </Link>
        </div>

        {/* High Level Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border/40 flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Total Views</span>
              <p className="text-3xl font-black mt-1">{totalViews}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-500">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border/40 flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">WhatsApp Enquiries</span>
              <p className="text-3xl font-black mt-1">{totalEnquiries}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <MessageSquare className="h-5 w-5 fill-current" />
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border/40 flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Total Shares</span>
              <p className="text-3xl font-black mt-1">{totalShares}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-500">
              <Share2 className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Viewed */}
          <div className="bg-card border border-border/40 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-border/40">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground">Most Viewed Footwear</h3>
            </div>
            <div className="divide-y divide-border/30">
              {topViewed.map((p, idx) => (
                <div key={p.id} className="p-4 px-6 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-black text-muted-foreground/30 w-6">{idx + 1}</span>
                    <div className="relative w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-900 overflow-hidden border border-border/40">
                      <Image src={p.images?.[0] || "/placeholder.jpg"} alt={p.name} fill className="object-contain p-1" sizes="48px" />
                    </div>
                    <p className="font-bold text-sm">{p.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg">{p.view_count || 0}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Enquired */}
          <div className="bg-card border border-border/40 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-border/40">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground">Highest Conversion (Enquiries)</h3>
            </div>
            <div className="divide-y divide-border/30">
              {topEnquired.map((p, idx) => (
                <div key={p.id} className="p-4 px-6 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-black text-muted-foreground/30 w-6">{idx + 1}</span>
                    <div className="relative w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-900 overflow-hidden border border-border/40">
                      <Image src={p.images?.[0] || "/placeholder.jpg"} alt={p.name} fill className="object-contain p-1" sizes="48px" />
                    </div>
                    <p className="font-bold text-sm">{p.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg text-emerald-600 dark:text-emerald-500">{p.enquiry_count || 0}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Enquiries</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
