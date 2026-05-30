"use client";

import { Award, HeartHandshake, BadgePercent, Zap } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: Award,
    title: "Premium Quality",
    description: "Crafted from hand-selected full-grain leathers, durable vulcanized soles, and robust stitching meant to withstand the test of time.",
  },
  {
    icon: HeartHandshake,
    title: "Comfortable Fit",
    description: "Engineered with orthotic cushioned insoles, padded collars, and breathable linings to keep your feet relaxed and fatigue-free all day.",
  },
  {
    icon: BadgePercent,
    title: "Affordable Pricing",
    description: "Experience premium, designer-grade footwear craftsmanship without the markup. True luxury made accessible to everyone.",
  },
  {
    icon: Zap,
    title: "Latest Designs",
    description: "Stay ahead of the curve. Our collection is continuously updated with modern trends, classic silhouettes, and athletic tech.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-neutral-50 dark:bg-neutral-900/30 border-y border-border/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-accent">
            Our Commitment
          </span>
          <h2 className="text-fluid-h2 font-display font-black tracking-tight">
            Why Choose Priya Foot Wear?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            For decades, we've focused on delivering an elite walking experience. We believe premium footwear shouldn't just look luxury; it must feel it.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, idx) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group p-8 rounded-2xl bg-card border border-border/40 hover:border-accent/30 hover:shadow-xl dark:hover:shadow-accent/5 hover:-translate-y-1 transition-all duration-300 relative flex flex-col items-start"
              >
                {/* Icon Container with Gold Glow */}
                <div className="p-4 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300 mb-6 flex items-center justify-center shadow-md">
                  <IconComponent className="h-6 w-6" />
                </div>

                <h3 className="font-display font-bold text-lg mb-3">
                  {benefit.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
