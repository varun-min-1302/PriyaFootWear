export default function ProductSkeleton() {
  return (
    <div className="flex flex-col bg-card rounded-2xl border border-border/40 overflow-hidden h-full">
      <div className="relative aspect-square bg-secondary/50 animate-pulse" />
      <div className="p-3 sm:p-5 flex flex-col flex-grow space-y-3">
        <div className="h-3 w-1/3 bg-secondary/50 rounded animate-pulse" />
        <div className="h-5 w-3/4 bg-secondary/50 rounded animate-pulse" />
        <div className="h-6 w-1/2 bg-secondary/50 rounded animate-pulse" />
        <div className="mt-auto space-y-2 pt-4">
          <div className="h-3 w-1/4 bg-secondary/50 rounded animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 w-6 sm:h-7 sm:w-7 bg-secondary/50 rounded-md animate-pulse" />
            ))}
          </div>
        </div>
        <div className="h-10 sm:h-11 w-full bg-secondary/50 rounded-xl mt-2 animate-pulse" />
      </div>
    </div>
  );
}
