"use client";

import { useState, useEffect, Suspense, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, ShieldAlert, ArrowLeft, KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Lifecycle States: "checking" | "ready" | "invalid_link" | "success"
  const [pageState, setPageState] = useState<"checking" | "ready" | "invalid_link" | "success">("checking");
  const [statusMessage, setStatusMessage] = useState("");

  // Form State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    const verifyRecoverySession = async () => {
      // 1. Check for error parameters in URL (e.g. from Supabase auth verify redirect)
      const errorParam = searchParams.get("error");
      const errorDesc = searchParams.get("error_description");
      if (errorParam) {
        if (isMounted) {
          setStatusMessage(errorDesc || "The password reset link is invalid or has expired.");
          setPageState("invalid_link");
        }
        return;
      }

      // 2. Check for PKCE code in query parameters
      const code = searchParams.get("code");
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          if (isMounted) {
            setStatusMessage(exchangeError.message || "Invalid or expired recovery code.");
            setPageState("invalid_link");
          }
          return;
        }

        // Code exchanged successfully into a valid recovery session
        if (isMounted) {
          setPageState("ready");
        }
        return;
      }

      // 3. Check for existing active recovery session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        if (isMounted) {
          setPageState("ready");
        }
        return;
      }

      // 4. Listen for auth state change (in case implicit hash tokens are still processing)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (!isMounted) return;
        if (event === "PASSWORD_RECOVERY" || (session && event === "SIGNED_IN")) {
          setPageState("ready");
        }
      });

      // 5. If after a brief delay no valid session was detected, mark as invalid
      const timer = setTimeout(async () => {
        if (!isMounted) return;
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession) {
          setPageState("invalid_link");
          setStatusMessage("No active password recovery session found. Please request a new reset link.");
        }
      }, 1500);

      return () => {
        subscription.unsubscribe();
        clearTimeout(timer);
      };
    };

    verifyRecoverySession();

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  // Handle countdown on success
  useEffect(() => {
    if (pageState !== "success") return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          startTransition(() => {
            router.push("/admin");
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [pageState, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (newPassword.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match. Please re-enter.");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setFormError(error.message || "Failed to update password. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Sign out the temporary recovery session so the admin can authenticate cleanly
      await supabase.auth.signOut();
      setPageState("success");
    } catch {
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            Administrator Security
          </span>
          <h1 className="text-2xl font-display font-bold uppercase tracking-tight text-foreground">
            {pageState === "success" ? "Password Updated" : "Reset Password"}
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium max-w-sm">
            {pageState === "success"
              ? "Your administrator credentials have been successfully updated."
              : pageState === "invalid_link"
              ? "The recovery link could not be verified."
              : "Choose a new secure password for your administrator account."}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="bg-card/60 backdrop-blur-xl border border-accent/20 rounded-2xl p-8 shadow-2xl shadow-black/10 dark:shadow-black/80 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" />

        {/* State 1: Checking Session */}
        {pageState === "checking" && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Verifying recovery authorization...
            </p>
          </div>
        )}

        {/* State 2: Invalid or Expired Link */}
        {pageState === "invalid_link" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300 text-xs font-medium space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <ShieldAlert className="h-4.5 w-4.5 text-red-600 dark:text-red-400 shrink-0" />
                <span>Link Invalid or Expired</span>
              </div>
              <p className="leading-relaxed">
                {statusMessage ||
                  "This password reset link is invalid, has expired, or has already been used. For your security, recovery links can only be used once."}
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <Link
                href="/admin/forgot-password"
                className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 text-center shadow-md cursor-pointer"
              >
                Request a New Reset Link
              </Link>
              <Link
                href="/admin"
                className="w-full py-3.5 rounded-xl border border-border text-foreground font-bold text-xs uppercase tracking-widest hover:bg-muted/40 transition-all duration-300 text-center cursor-pointer"
              >
                Back to Admin Login
              </Link>
            </div>
          </div>
        )}

        {/* State 3: Ready — Password Form */}
        {pageState === "ready" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">
                New Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Minimum 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/60 text-foreground transition-all duration-300 font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-accent transition-colors duration-200 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/60 text-foreground transition-all duration-300 font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-accent transition-colors duration-200 cursor-pointer"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Password Validation Hints */}
            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-[11px] space-y-1.5 text-muted-foreground">
              <div className={`flex items-center gap-1.5 ${newPassword.length >= 8 ? "text-emerald-500 font-bold" : ""}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? "bg-emerald-500" : "bg-neutral-400"}`} />
                <span>At least 8 characters in length</span>
              </div>
              <div className={`flex items-center gap-1.5 ${newPassword && confirmPassword && newPassword === confirmPassword ? "text-emerald-500 font-bold" : ""}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${newPassword && confirmPassword && newPassword === confirmPassword ? "bg-emerald-500" : "bg-neutral-400"}`} />
                <span>Passwords match</span>
              </div>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || newPassword.length < 8 || newPassword !== confirmPassword}
              className="w-full py-4 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md shadow-accent/10 hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Set New Password
                </>
              )}
            </button>
          </form>
        )}

        {/* State 4: Success */}
        {pageState === "success" && (
          <div className="space-y-6 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">Password Reset Complete</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your new administrator password has been saved. You can now use your updated password to sign in.
              </p>
              <p className="text-[11px] font-bold text-accent pt-2">
                Redirecting to login in {countdown}s...
              </p>
            </div>

            <Link
              href="/admin"
              className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 text-center shadow-md cursor-pointer"
            >
              Sign In to Console
            </Link>
          </div>
        )}
      </div>

      {/* Footer Back Link */}
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
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Background ambient glows matching the website design */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 bg-card/60 backdrop-blur-xl border border-accent/20 rounded-2xl flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Loading recovery console...
            </p>
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
