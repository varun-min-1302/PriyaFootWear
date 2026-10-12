"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [emailInput, setEmailInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const trimmed = emailInput.trim();
    if (!trimmed) {
      setIsLoading(false);
      return;
    }

    // Support both direct email and 10-digit registered admin phone number
    const targetEmail = trimmed.includes("@")
      ? trimmed.toLowerCase()
      : `${trimmed.replace(/\D/g, "")}@admin.com`;

    try {
      const supabase = createClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const redirectTo = `${origin}/admin/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo,
      });

      // Handle genuine rate limit issues (e.g. status 429)
      if (error && (error.status === 429 || error.message.toLowerCase().includes("rate limit") || error.message.toLowerCase().includes("seconds"))) {
        setErrorMessage("Too many requests. Please wait a minute before requesting another reset link.");
        setIsLoading(false);
        return;
      }

      // Security requirement: Never reveal whether an email exists in the database
      // Always show standard confirmation to prevent email enumeration
      setSubmitted(true);
    } catch {
      // In case of unexpected network failure, still show the generic confirmation or friendly error
      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Background ambient glows matching the website design */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-10 space-y-4">
          <div className="w-16 h-16 rounded-full bg-neutral-900 border border-accent/30 flex items-center justify-center p-3 shadow-lg shadow-accent/5">
            <Image
              src="/images/logo.svg"
              alt="Priya Foot Wear"
              width={40}
              height={40}
              className="w-auto h-auto"
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-extrabold tracking-[0.3em] uppercase text-accent">
              Staff Security Recovery
            </span>
            <h1 className="text-2xl font-display font-bold uppercase tracking-tight text-foreground">
              Forgot Password
            </h1>
            <p className="text-[11px] text-muted-foreground font-medium max-w-sm">
              Enter your registered administrator email address to receive password reset instructions.
            </p>
          </div>
        </div>

        {/* Card Form */}
        <div className="bg-card/60 backdrop-blur-xl border border-accent/20 rounded-2xl p-8 shadow-2xl shadow-black/10 dark:shadow-black/80 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" />

          {submitted ? (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Check Your Inbox</span>
                </div>
                <p className="leading-relaxed">
                  If an administrator account is associated with this email address, password reset instructions have been dispatched.
                </p>
                <p className="text-[11px] text-muted-foreground pt-1">
                  Please check your inbox and spam folder. The recovery link will expire shortly for security.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setEmailInput("");
                    setErrorMessage("");
                  }}
                  className="w-full py-3.5 rounded-xl border border-border text-foreground font-bold text-xs uppercase tracking-widest hover:bg-muted/40 transition-all duration-300 cursor-pointer"
                >
                  Try Another Email
                </button>
                <Link
                  href="/admin"
                  className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 text-center cursor-pointer shadow-md"
                >
                  Return to Admin Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">
                  Registered Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    type="text"
                    required
                    autoFocus
                    placeholder="admin@example.com or 10-digit number"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/60 text-foreground transition-all duration-300 font-semibold"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Instructions will be delivered with a secure single-use recovery link.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md shadow-accent/10 hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Send Reset Instructions
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Back navigation */}
        <div className="flex justify-center mt-8">
          <Link
            href="/admin"
            className="text-neutral-500 hover:text-accent text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 flex items-center gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
