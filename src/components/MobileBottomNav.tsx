"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, Scale, Menu } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Don't show on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const tabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/products", icon: Search },
    { name: "Wishlist", href: "/wishlist", icon: Heart },
    { name: "Compare", href: "/compare", icon: Scale },
  ];

  return (
    <>
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-background/70 backdrop-blur-xl border border-border/50 shadow-2xl shadow-black/20 dark:shadow-black/50 z-50 rounded-full px-2 py-2">
        <div className="flex justify-between items-center relative">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || (tab.href !== "/" && pathname?.startsWith(tab.href));
            const Icon = tab.icon;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                prefetch={true}
                className="relative flex flex-col items-center justify-center w-14 h-14 z-10"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-accent/10 dark:bg-accent/20 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`h-5 w-5 transition-colors duration-300 ${isActive ? "text-accent fill-accent/20" : "text-muted-foreground"}`} />
                <span className={`text-[9px] font-bold mt-1 tracking-wider transition-colors duration-300 ${isActive ? "text-accent" : "text-muted-foreground"}`}>
                  {tab.name}
                </span>
              </Link>
            );
          })}
          
          {/* Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative flex flex-col items-center justify-center w-14 h-14 z-10"
          >
            <Menu className="h-5 w-5 text-muted-foreground" />
            <span className="text-[9px] font-bold mt-1 tracking-wider text-muted-foreground">
              Menu
            </span>
          </button>
        </div>
      </div>

      {/* Slide-up Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="md:hidden fixed inset-0 z-40 flex flex-col justify-end pointer-events-none"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={() => setIsMenuOpen(false)} />
            <div className="bg-card rounded-t-3xl border-t border-border/50 p-6 pb-32 pointer-events-auto relative z-50">
              <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6" />
              <div className="flex flex-col gap-4">
                <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-900 active:scale-95 transition-transform">
                  <div className="p-3 bg-white dark:bg-black rounded-xl shadow-sm"><Search className="h-5 w-5 text-foreground" /></div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">Contact Support</h4>
                    <p className="text-xs text-muted-foreground">Get help via WhatsApp</p>
                  </div>
                </Link>
                {/* Add more menu items here if needed */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
