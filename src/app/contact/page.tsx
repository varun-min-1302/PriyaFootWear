"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

// Zod Validation Schema for Contact Form (Indian standard 10-digit mobile)
const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, { message: "Please enter a valid 10-digit mobile number" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    // Mock API submission lag
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Contact form submitted successfully:", data);
    setIsSubmitted(true);
    reset();
    
    // Automatically close success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="pt-24 bg-background min-h-screen">
      {/* Page Header */}
      <section className="py-16 text-center max-w-3xl mx-auto px-4 space-y-4">
        <span className="text-xs font-bold tracking-[0.25em] uppercase text-accent">
          Get in Touch
        </span>
        <h1 className="text-fluid-h2 font-display font-black tracking-tight uppercase leading-none">
          Contact Store
        </h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Have questions about sizing, pricing, or shipping? Fill out the contact form below, or click to chat with our footwear specialists directly via WhatsApp.
        </p>
      </section>

      {/* Main Form and Info Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16">
        
        {/* Left Column: Zod-validated Form (7 cols) */}
        <div className="lg:col-span-7 bg-card border border-border/40 p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-sm">
          {/* Success Overlay */}
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-card/95 backdrop-blur-sm z-15 flex flex-col items-center justify-center p-6 text-center space-y-4"
            >
              <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce" />
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-lg">Inquiry Sent Successfully!</h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Thank you for contacting Priya Foot Wear. Our customer support staff will call or message you shortly.
                </p>
              </div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="py-2.5 px-6 rounded-xl bg-foreground text-background font-bold text-xs uppercase tracking-wider"
              >
                Send New Message
              </button>
            </motion.div>
          )}

          <h2 className="font-display font-black text-xl uppercase tracking-wide mb-6">
            Send Us an Inquiry
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs uppercase tracking-widest text-muted-foreground font-extrabold block">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g., Rohan Malhotra"
                {...register("name")}
                className={`w-full px-4 py-3 bg-muted border ${
                  errors.name ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-border/50 focus:border-accent focus:ring-accent/20"
                } focus:ring-2 focus:ring-offset-0 rounded-xl text-sm transition-all outline-none`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 font-semibold">{errors.name.message}</p>
              )}
            </div>

            {/* Phone Input */}
            <div className="space-y-2">
              <label htmlFor="phone" className="text-xs uppercase tracking-widest text-muted-foreground font-extrabold block">
                Mobile Number (10 Digits)
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="e.g., 9876543210"
                {...register("phone")}
                className={`w-full px-4 py-3 bg-muted border ${
                  errors.phone ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-border/50 focus:border-accent focus:ring-accent/20"
                } focus:ring-2 focus:ring-offset-0 rounded-xl text-sm transition-all outline-none`}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 font-semibold">{errors.phone.message}</p>
              )}
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <label htmlFor="message" className="text-xs uppercase tracking-widest text-muted-foreground font-extrabold block">
                Message / Footwear Requirements
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="Detail what type of shoes, size, or color you are looking for..."
                {...register("message")}
                className={`w-full px-4 py-3 bg-muted border ${
                  errors.message ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-border/50 focus:border-accent focus:ring-accent/20"
                } focus:ring-2 focus:ring-offset-0 rounded-xl text-sm transition-all outline-none resize-none`}
              />
              {errors.message && (
                <p className="text-xs text-red-500 font-semibold">{errors.message.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2.5 w-full py-4.5 rounded-xl bg-foreground text-background font-bold text-xs uppercase tracking-widest hover:bg-accent hover:text-accent-foreground disabled:opacity-50 transition-all duration-300 shadow-md shadow-accent/5 cursor-pointer active:scale-98"
            >
              {isSubmitting ? (
                <span>Submitting Inquiry...</span>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Inquiry
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Contact Cards & Map (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Quick Info Grid */}
          <div className="p-8 rounded-3xl bg-card border border-border/40 space-y-6 shadow-sm">
            <h3 className="font-display font-black text-lg uppercase tracking-wide border-b border-border/40 pb-4">
              Direct Contact
            </h3>
            
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-muted text-accent shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Our Showroom Address</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    123 Main Bazar Road, Shopping Plaza,<br />
                    Opposite Town Hall, New Delhi, 110001
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-muted text-accent shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">WhatsApp Chat</h4>
                  <a
                    href="https://wa.me/918374284265"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-600 hover:underline font-semibold block mt-1"
                  >
                    +91 83742 84265 (Click to chat)
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-muted text-accent shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Phone Hotline</h4>
                  <a href="tel:+918374284265" className="text-xs text-muted-foreground hover:text-foreground font-semibold block mt-1">
                    +91 83742 84265 (Mon - Sat)
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-muted text-accent shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Showroom Hours</h4>
                  <div className="text-xs text-muted-foreground leading-relaxed mt-1 space-y-0.5">
                    <p className="font-semibold text-neutral-300">Mon - Sat: 10:00 AM - 08:30 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Styled Google Maps iframe */}
          <div className="rounded-3xl border border-border/40 overflow-hidden h-[250px] relative shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112000.52841968853!2d77.12351996155601!3d28.644146197177652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(1) invert(0.9) contrast(1.2)" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Priya Foot Wear Showroom Google Map Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
