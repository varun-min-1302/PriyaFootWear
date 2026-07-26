import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center p-8 bg-card/40 backdrop-blur-sm border border-border/50 rounded-3xl shadow-2xl">
        <Loader2 className="h-12 w-12 text-accent animate-spin mb-6" />
        <h2 className="text-xl font-display font-black tracking-widest uppercase text-foreground mb-2">
          Loading
        </h2>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Please wait...
        </p>
      </div>
    </div>
  );
}
