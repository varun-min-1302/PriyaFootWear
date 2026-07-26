"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import PillNav from "@/components/PillNav";
import { Sun, Moon, PhoneCall } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Shrink/Solidify header background on scroll
  useEffect(() => {
    // intentionally correct for hydration
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Collection", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/30 py-3 shadow-md"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between md:justify-center relative min-h-[50px]">
        
        {/* Core Navigation: logo + interactive pills menu (Centered absolutely on desktop) */}
        <div className="w-full md:w-auto md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 flex justify-center">
          <PillNav
            logo="/images/logo.svg"
            logoAlt="Priya Foot Wear Logo"
            items={navItems}
            activeHref={pathname}
            baseColor="var(--background)"
            pillColor="var(--card)"
            hoveredPillTextColor="var(--accent)"
            pillTextColor="var(--foreground)"
            className="rounded-full shadow-md"
          />
        </div>

        {/* Right side Actions (Only visible on desktop, aligned to the right relative parent) */}
        <div className="hidden md:flex items-center space-x-3.5 md:absolute md:right-4 lg:right-8 md:top-1/2 md:-translate-y-1/2">
          {/* Theme Toggler */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 text-muted-foreground hover:text-accent transition-colors duration-200 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-4.5 w-4.5 text-accent animate-pulse" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
          </button>

          {/* Hot call button */}
          <a
            href="tel:+918374284265"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-foreground text-background font-bold text-xs uppercase tracking-wider hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-md shadow-accent/5 hover:scale-105 active:scale-95"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            Call Now
          </a>
        </div>
      </div>
    </header>
  );
}
