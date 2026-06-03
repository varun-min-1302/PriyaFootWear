"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { MessageSquare, PhoneCall, ChevronRight, Check, ZoomIn, Share2 } from "lucide-react";
import { Product } from "@/types/product";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  // Local Details State
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [zoomStyle, setZoomStyle] = useState<{ transform: string; transformOrigin: string }>({
    transform: "scale(1)",
    transformOrigin: "center",
  });

  // Pre-select first size and color on product load
  useEffect(() => {
    if (product) {
      if (product.sizes.length > 0) setSelectedSize(product.sizes[0]);
      if (product.colors.length > 0) setSelectedColor(product.colors[0]);
      setActiveImageIndex(0);
    }
  }, [product]);

  // Format price in Indian Rupees
  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} from Priya Footwear`,
      url: `${window.location.origin}/products/${product.slug}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard!");
    }
  };

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(product.price);

  // Generate dynamic WhatsApp Message URL based on selection
  const inquiryText = `Hi Priya Foot Wear,\n\nI am interested in:\nProduct Name: ${product.name}\nProduct ID: ${product.id}\nSize: ${selectedSize || "Not Selected"}\nColor: ${selectedColor || "Not Selected"}\n\nPlease share availability.`;
  const whatsappUrl = `https://wa.me/918374284265?text=${encodeURIComponent(inquiryText)}`;

  // Image zoom handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transform: "scale(1.8)",
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: "scale(1)",
      transformOrigin: "center",
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((touch.clientX - left) / width) * 100;
    const y = ((touch.clientY - top) / height) * 100;
    setZoomStyle({
      transform: "scale(1.8)",
      transformOrigin: `${x}% ${y}%`,
    });
  };

  return (
    <div className="pt-24 bg-background min-h-screen">
      {/* Breadcrumb bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-border/40 text-xs flex items-center gap-1.5 text-muted-foreground font-medium uppercase tracking-wider">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-foreground">Collection</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-bold">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          
          {/* Left Column: Image Gallery with Zoom */}
          <div className="space-y-4">
            {/* Primary Zoom Preview Image */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseLeave}
              className="relative aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-3xl border border-border/40 overflow-hidden cursor-crosshair group shadow-sm"
            >
              {/* Product Badge */}
              <div className="absolute top-5 left-5 z-10 pointer-events-none">
                {product.newArrival && (
                  <span className="px-3 py-1.5 text-xs font-extrabold tracking-widest uppercase bg-accent text-accent-foreground rounded-full shadow-lg">
                    New Arrival
                  </span>
                )}
              </div>

              {/* Hover Instructions */}
              <div className="absolute bottom-5 right-5 z-10 pointer-events-none flex items-center gap-1 bg-black/50 text-white backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider group-hover:opacity-0 transition-opacity duration-300">
                <ZoomIn className="h-3.5 w-3.5 text-accent" />
                Tap / Hover to zoom
              </div>

              {/* Standard Image */}
              <Image
                src={product.images[activeImageIndex] || product.images[0] || "/placeholder.jpg"}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-contain p-4 transition-transform duration-200"
                style={zoomStyle}
                priority
              />
            </div>

            {/* Thumbnail Navigation Row */}
            {product.images.length > 1 && (
              <div className="flex gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 border transition-all duration-300 ${
                      activeImageIndex === idx
                        ? "border-accent scale-95 ring-1 ring-accent"
                        : "border-border/60 hover:border-foreground/30"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Footwear Details & Actions */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Category & Title */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-bold tracking-wider text-accent uppercase">
                  {product.category}
                </span>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  ID: {product.id}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-display font-black text-fluid-h2 tracking-tight leading-none">
                  {product.name}
                </h1>
                <button 
                  onClick={handleShare}
                  className="p-3 rounded-full bg-neutral-100 hover:bg-accent hover:text-accent-foreground text-foreground transition-all duration-300 shadow-sm flex-shrink-0"
                  title="Share Product"
                  aria-label="Share Product"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
              
              {product.material && (
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Material: <span className="text-foreground">{product.material}</span>
                </p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                Price Inquiry
              </span>
              <p className="text-4xl font-black text-foreground tracking-tight">
                {formattedPrice}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                Product Description
              </span>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-sans font-medium">
                {product.description}
              </p>
            </div>

            {/* Sizes Selectors */}
            {product.sizes.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground flex justify-between items-center">
                  <span>Select Size (UK)</span>
                  <span className="text-accent text-xs font-bold italic">Standard UK fit</span>
                </span>
                
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[48px] h-12 px-3 rounded-xl border text-sm font-bold flex items-center justify-center transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-foreground text-background border-foreground dark:bg-white dark:text-black dark:border-white shadow-md scale-105"
                            : "border-border/80 dark:border-border/20 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Colors Selectors */}
            {product.colors.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground block">
                  Select Color
                </span>
                
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-foreground text-background border-foreground dark:bg-white dark:text-black dark:border-white shadow-md"
                            : "border-border/80 dark:border-border/20 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 text-accent" />}
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border/40">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-grow flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-emerald-950/10 hover:shadow-emerald-950/20 active:scale-95"
              >
                <MessageSquare className="h-4.5 w-4.5" />
                WhatsApp Inquiry
              </a>

              <a
                href="tel:+918374284265"
                className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 font-extrabold text-xs uppercase tracking-widest transition-all duration-300 active:scale-95"
              >
                <PhoneCall className="h-4.5 w-4.5 text-accent" />
                Call Store
              </a>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-border/40 space-y-10">
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
                Complete Your Look
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight uppercase">
                Related Collections
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
