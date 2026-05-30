import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border/40 pt-20 pb-10 relative overflow-hidden flex flex-col items-center">
      {/* Top Section: Grid Layout */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Logo & Copyright (Takes 2 cols on md for spacing) */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-foreground text-background p-1.5 rounded flex items-center justify-center">
                <Heart className="h-5 w-5" />
              </div>
              <span className="font-display font-bold text-lg text-foreground tracking-tight">
                Priya Footwear
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © copyright Priya Footwear 2024. All rights reserved.
            </p>
          </div>

          {/* Links Columns */}
          <div className="space-y-6">
            <h4 className="font-bold text-sm text-foreground">Pages</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-sm text-foreground">Socials</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">WhatsApp</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-sm text-foreground">Staff</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/admin" className="hover:text-foreground transition-colors">Staff Login</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Support</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Giant Watermark Text */}
      <div className="mt-20 w-full flex justify-center pointer-events-none select-none z-0">
        <span className="text-[12vw] sm:text-[15vw] font-display font-black text-foreground/[0.03] dark:text-foreground/[0.02] tracking-tighter leading-none whitespace-nowrap">
          PriyaFootwear
        </span>
      </div>
    </footer>
  );
}
