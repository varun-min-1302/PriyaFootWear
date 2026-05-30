"use client";

import { Star, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    rating: 5,
    name: "Rohan Malhotra",
    location: "New Delhi",
    purchased: "Aurelius Oxford Dress Shoe",
    text: "Absolutely stunning dress shoes. The calfskin leather feels incredibly premium, and the cushioning is better than shoes that cost twice as much. Contacted the store on WhatsApp, they helped me pick the right size, and shipped it to me the same day.",
  },
  {
    rating: 5,
    name: "Vikram Sen",
    location: "Mumbai",
    purchased: "Vantage Leather Sneaker",
    text: "Perfect casual shoe for daily wear. Clean, minimalist, and goes with everything from chinos to jeans. The leather is super soft right out of the box with zero blisters. The store staff was very responsive on WhatsApp.",
  },
  {
    rating: 5,
    name: "Amit Thapa",
    location: "Bangalore",
    purchased: "Apex Aero Runner",
    text: "Excellent running shoes! Extremely lightweight and responsive foam. The grip is perfect for both wet roads and trail jogging. The checkout inquiry was very fast. I highly recommend Priya Foot Wear for their quality catalog.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-neutral-50 dark:bg-neutral-900/30 border-t border-border/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-accent">
            Client Stories
          </span>
          <h2 className="text-fluid-h2 font-display font-black tracking-tight">
            Loved By Our Customers
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Don't just take our word for it. Here is what gentlemen across the country are saying about our leather quality, fitting, and service.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div
              key={test.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 rounded-2xl bg-card border border-border/40 hover:border-accent/20 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Star rating */}
                <div className="flex gap-0.5 text-accent">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 fill-current" />
                  ))}
                </div>
                
                {/* Review Text */}
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "{test.text}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="mt-8 pt-6 border-t border-border/40 flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-sm text-foreground">
                    {test.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {test.location}
                  </p>
                </div>
                
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="h-3 w-3" />
                  Verified Buyer
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
