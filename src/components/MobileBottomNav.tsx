"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, Phone } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Don't show on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const tabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/products", icon: Search },
    { name: "Wishlist", href: "/wishlist", icon: Heart },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border/40 z-50 pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== "/" && pathname?.startsWith(tab.href));
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "fill-primary/20" : ""}`} />
              <span className="text-[10px] font-medium">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
