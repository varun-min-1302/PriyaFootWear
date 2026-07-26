/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Phone } from "lucide-react";

export interface PillNavItem {
  label: string;
  href: string;
  ariaLabel?: string;
}

export interface PillNavProps {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
}

const PillNav = ({
  logo,
  logoAlt = "Logo",
  items,
  activeHref,
  className = "",
  ease = "power3.easeOut",
  baseColor = "#fff",
  pillColor = "#120F17",
  hoveredPillTextColor = "#120F17",
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true,
}: PillNavProps) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);
  const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRefs = useRef<(gsap.core.Timeline | null)[]>([]);
  const activeTweenRefs = useRef<(gsap.core.Tween | null)[]>([]);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    // intentionally correct for hydration
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const layout = () => {
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector(".pill-label");
        const white = pill.querySelector(".pill-label-hover");

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: "auto" }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: "auto" }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: "hidden", opacity: 0, scaleY: 1, y: 0 });
    }

    if (initialLoadAnimation && !hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      const logoEl = logoRef.current;
      const navItemsEl = navItemsRef.current;

      if (logoEl) {
        gsap.set(logoEl, { scale: 0 });
        gsap.to(logoEl, {
          scale: 1,
          duration: 0.6,
          ease,
        });
      }

      if (navItemsEl) {
        gsap.set(navItemsEl, { width: 0, overflow: "hidden" });
        gsap.to(navItemsEl, {
          width: "auto",
          duration: 0.6,
          ease,
        });
      }
    }

    return () => window.removeEventListener("resize", onResize);
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto",
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll(".hamburger-line");
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: "visible" });
        gsap.fromTo(
          menu,
          { x: "100%", opacity: 0 },
          {
            x: "0%",
            opacity: 1,
            duration: 0.4,
            ease: "power3.out",
          }
        );
      } else {
        gsap.to(menu, {
          x: "100%",
          opacity: 0,
          duration: 0.3,
          ease: "power3.in",
          onComplete: () => {
            gsap.set(menu, { visibility: "hidden" });
          },
        });
      }
    }

    onMobileMenuClick?.();
  };

  const isExternalLink = (href: string) =>
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#");

  const isRouterLink = (href: string) => href && !isExternalLink(href);

  const cssVars = useMemo(() => ({
    "--base": baseColor,
    "--pill-bg": pillColor,
    "--hover-text": hoveredPillTextColor,
    "--pill-text": resolvedPillTextColor,
    "--nav-h": "42px",
    "--logo": "36px",
    "--pill-pad-x": "18px",
    "--pill-gap": "3px",
  }), [baseColor, pillColor, hoveredPillTextColor, resolvedPillTextColor]) as React.CSSProperties;

  return (
    <div className="relative z-[1000] w-full md:w-auto">
      <nav
        className={`w-full md:w-max flex items-center justify-between md:justify-start box-border px-4 md:px-0 bg-[var(--base)] md:bg-transparent border border-border/10 md:border-0 ${className}`}
        aria-label="Primary"
        style={cssVars}
      >
        {isRouterLink(items?.[0]?.href) ? (
          <Link
            href={items[0].href}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            role="menuitem"
            ref={(el) => {
              logoRef.current = el;
            }}
            className="rounded-full px-4 inline-flex items-center justify-center gap-2 overflow-hidden hover:scale-[1.02] transition-transform duration-300 shrink-0"
            style={{
              height: "var(--nav-h)",
              background: "var(--base, #000)",
            }}
          >
            <div className="w-[18px] h-[18px] relative shrink-0">
              <img src={logo} alt={logoAlt} ref={logoImgRef} className="w-full h-full object-contain block" />
            </div>
            <span className="font-display text-[13px] font-black tracking-widest text-foreground uppercase select-none">
              Priya<span className="text-accent">Footwear</span>
            </span>
          </Link>
        ) : (
          <a
            href={items?.[0]?.href || "#"}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            ref={(el) => {
              logoRef.current = el;
            }}
            className="rounded-full px-4 inline-flex items-center justify-center gap-2 overflow-hidden hover:scale-[1.02] transition-transform duration-300 shrink-0"
            style={{
              height: "var(--nav-h)",
              background: "var(--base, #000)",
            }}
          >
            <div className="w-[18px] h-[18px] relative shrink-0">
              <img src={logo} alt={logoAlt} ref={logoImgRef} className="w-full h-full object-contain block" />
            </div>
            <span className="font-display text-[13px] font-black tracking-widest text-foreground uppercase select-none">
              Priya<span className="text-accent">Footwear</span>
            </span>
          </a>
        )}

        <div
          ref={navItemsRef}
          className="relative items-center rounded-full hidden md:flex ml-2"
          style={{
            height: "var(--nav-h)",
            background: "var(--base, #000)",
          }}
        >
          <ul
            role="menubar"
            className="list-none flex items-stretch m-0 p-[3px] h-full"
            style={{ gap: "var(--pill-gap)" }}
          >
            {items.map((item, i) => {
              const isActive = activeHref === item.href;

              const pillStyle = {
                background: "var(--pill-bg, #fff)",
                color: "var(--pill-text, var(--base, #000))",
                paddingLeft: "var(--pill-pad-x)",
                paddingRight: "var(--pill-pad-x)",
              };

              const PillContent = (
                <>
                  <span
                    className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                    style={{
                      background: "var(--base, #000)",
                      willChange: "transform",
                    }}
                    aria-hidden="true"
                    ref={(el) => {
                      circleRefs.current[i] = el;
                    }}
                  />
                  <span className="label-stack relative inline-block leading-[1] z-[2]">
                    <span
                      className="pill-label relative z-[2] inline-block leading-[1]"
                      style={{ willChange: "transform" }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                      style={{
                        color: "var(--hover-text, #fff)",
                        willChange: "transform, opacity",
                      }}
                      aria-hidden="true"
                    >
                      {item.label}
                    </span>
                  </span>
                  {isActive && (
                    <span
                      className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rounded-full z-[4]"
                      style={{ background: "var(--base, #000)" }}
                      aria-hidden="true"
                    />
                  )}
                </>
              );

              const basePillClasses =
                "relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-semibold text-[16px] leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer px-0";

              return (
                <li key={item.href} role="none" className="flex h-full">
                  {isRouterLink(item.href) ? (
                    <Link
                      role="menuitem"
                      href={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      {PillContent}
                    </Link>
                  ) : (
                    <a
                      role="menuitem"
                      href={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      {PillContent}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <button
          ref={hamburgerRef}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden rounded-full border-0 flex flex-col items-center justify-center gap-1 cursor-pointer p-0 relative"
          style={{
            width: "var(--nav-h)",
            height: "var(--nav-h)",
            background: "var(--base, #000)",
          }}
        >
          <span
            className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: "var(--foreground, #000)" }}
          />
          <span
            className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: "var(--foreground, #000)" }}
          />
        </button>
      </nav>

      <div
        ref={mobileMenuRef}
        className="md:hidden fixed inset-0 z-[9999] flex justify-end visibility-hidden opacity-0"
        style={{ visibility: "hidden", opacity: 0 }}
      >
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => toggleMobileMenu()}
          aria-hidden="true"
        />
        
        <div 
          className="relative w-[85%] max-w-sm h-full shadow-2xl flex flex-col pt-16 px-6 pb-6 overflow-y-auto"
          style={{ background: "var(--background, #fafafa)" }}
        >
          <button 
            className="absolute top-6 right-6 p-2 rounded-full bg-muted flex items-center justify-center cursor-pointer w-10 h-10 hover:bg-muted/80 transition-colors"
            onClick={() => toggleMobileMenu()}
            aria-label="Close menu"
          >
            <span className="w-5 h-0.5 bg-foreground rotate-45 absolute" />
            <span className="w-5 h-0.5 bg-foreground -rotate-45 absolute" />
          </button>

          <ul className="list-none m-0 p-0 flex flex-col gap-4 mt-8">
            {items.map((item) => {
              const linkClasses =
                "block py-4 px-4 text-xl font-bold rounded-2xl transition-all duration-200 bg-muted/50 hover:bg-muted text-foreground";

              return (
                <li key={item.href}>
                  {isRouterLink(item.href) ? (
                    <Link href={item.href} className={linkClasses} onClick={() => toggleMobileMenu()}>
                      {item.label}
                    </Link>
                  ) : (
                    <a href={item.href} className={linkClasses} onClick={() => toggleMobileMenu()}>
                      {item.label}
                    </a>
                  )}
                </li>
              );
            })}
            
            <li className="pt-6 mt-4 border-t border-border flex flex-col gap-4">
              <button
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                  toggleMobileMenu();
                }}
                className="w-full text-left py-4 px-4 text-lg font-bold rounded-2xl transition-all duration-200 flex items-center gap-3 bg-muted/50 hover:bg-muted text-foreground cursor-pointer"
              >
                {mounted && theme === "dark" ? (
                  <>
                    <Sun className="h-5 w-5 text-accent" />
                    <span>Switch to Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5" />
                    <span>Switch to Dark Mode</span>
                  </>
                )}
              </button>

              <a
                href="tel:+918374284265"
                onClick={() => toggleMobileMenu()}
                className="w-full py-4 px-4 text-lg font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Phone className="h-5 w-5" />
                <span>Call Store Now</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PillNav;
