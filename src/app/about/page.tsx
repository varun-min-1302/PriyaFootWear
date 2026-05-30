"use client";

import Image from "next/image";
import Link from "next/link";
import { Compass, Sparkles, Award, HeartHandshake, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: "Master Craftsmanship",
      text: "Every item in our catalogue is sourced from workshops that follow traditional cordwaining techniques, ensuring stitch-perfect quality.",
    },
    {
      icon: HeartHandshake,
      title: "Walk-in Comfort",
      text: "We fit every shoe with orthotic cushions and breathable linings so that walking is a pleasure, not a chore.",
    },
    {
      icon: Compass,
      title: "Timeless Styling",
      text: "We balance heritage formal designs with modern athletic technology to bring you footwear that remains stylish for years.",
    },
  ];

  const galleryImages = [
    "/images/products/catwog-649-chappal-1.png",
    "/images/products/leefox-699-leefox-chappal-1.png",
    "/images/products/pcw-289-pcw-black-1.png",
    "/images/products/aerowalk-599-aerowalk-1.png",
  ];

  return (
    <div className="pt-24 bg-background min-h-screen">
      {/* 1. Header Hero Banner */}
      <section className="relative py-28 bg-neutral-950 text-white overflow-hidden text-center">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1600"
            alt="Leather Footwear Background"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        {/* Dark Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/85 to-black/60" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-accent">
            Our Legacy
          </span>
          <h1 className="text-fluid-h1 font-display font-black tracking-tight uppercase leading-none">
            About Priya Foot Wear
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto font-sans leading-relaxed">
            Crafting premium men's footwear designs since 1998. We believe in providing comfort, durability, and style at unmatched prices.
          </p>
        </div>
      </section>

      {/* 2. Brand Story Narrative */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image composition */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-square rounded-3xl overflow-hidden border border-border/40 bg-neutral-100 dark:bg-neutral-900 group"
          >
            <Image
              src="https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=800"
              alt="Bespoke dress shoe crafting"
              fill
              className="object-cover object-center group-hover:scale-102 transition-transform duration-700"
            />
            {/* Golden Mesh Ring */}
            <div className="absolute inset-0 border-[10px] border-accent/20 rounded-3xl pointer-events-none" />
          </motion.div>

          {/* Narrative Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-bold tracking-widest uppercase text-accent">
                Our Narrative
              </span>
            </div>
            
            <h2 className="text-fluid-h3 font-display font-black tracking-tight leading-tight">
              Walk With Confidence, <br />
              Step With Distinction.
            </h2>
            
            <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed font-sans">
              <p>
                Priya Foot Wear began as a small boutique workshop with a singular goal: to create footwear that respects both the heritage of men's styling and the biological need for foot comfort. 
              </p>
              <p>
                Over the years, we have expanded our catalogue to cater to all walks of life—whether you need premium, mirror-shine Oxford dress shoes for your boardroom meetings, robust athletic trainers for trail running, or casual suede loaders for Sunday brunches.
              </p>
              <p>
                We bypass high-end distributor markups to bring you wholesale-quality footwear straight from the source. By publishing our catalog digitally, we enable local and national footwear enthusiasts to discover and order premium shoes with a simple WhatsApp inquiry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="py-24 bg-neutral-50 dark:bg-neutral-900/30 border-y border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Mission */}
          <div className="space-y-4">
            <span className="text-xs font-bold tracking-widest text-accent uppercase">01 / Our Mission</span>
            <h3 className="text-2xl font-display font-black tracking-tight uppercase">To Redefine Premium Quality</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans font-medium">
              Our mission is to deliver high-character, durable footwear that provides complete structural support for feet, using genuine leathers and vulcanized materials. We aim to make luxury footwear affordable to everyday men without dilution of quality.
            </p>
          </div>

          {/* Vision */}
          <div className="space-y-4">
            <span className="text-xs font-bold tracking-widest text-accent uppercase">02 / Our Vision</span>
            <h3 className="text-2xl font-display font-black tracking-tight uppercase">Seamless Digital Cataloging</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans font-medium">
              We envision building India's most client-centric digital catalog for men's footwear, bridging the gap between digital discovery and direct offline-retail inquiry. We aim to enable direct store consultations for size and fit in 3 clicks or less.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Values */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-accent">Core Values</span>
          <h2 className="text-fluid-h3 font-display font-black tracking-tight">The Principles We Stand By</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="p-8 rounded-2xl bg-card border border-border/40 space-y-4">
                <div className="p-3 rounded-lg bg-neutral-900 dark:bg-neutral-800 text-accent w-fit shadow-md">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-display font-bold text-lg">{v.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Interactive Store Gallery */}
      <section className="py-24 bg-neutral-50 dark:bg-neutral-900/30 border-t border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-accent">Visual Tour</span>
            <h2 className="text-fluid-h3 font-display font-black tracking-tight">Boutique Store Gallery</h2>
            <p className="text-sm text-muted-foreground">Take a peek inside our New Delhi retail showroom, housing over 2,000+ distinct footwear fittings.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((src, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-border/40 group shadow-sm">
                <Image
                  src={src}
                  alt={`Boutique showroom shoe display ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 300px"
                  className="object-contain object-center p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="py-24 max-w-4xl mx-auto px-4 text-center space-y-8">
        <h3 className="text-fluid-h3 font-display font-black tracking-tight">Ready to Find Your Shoes?</h3>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
          Explore our collection and find the style that fits you. Contact our store on WhatsApp for direct purchase and size inquiries.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-accent text-accent-foreground font-extrabold text-xs uppercase tracking-widest hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-md shadow-accent/10"
        >
          View Product Collection
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
