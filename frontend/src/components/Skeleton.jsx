export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-card">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-10 w-full mt-3" />
      </div>
    </div>
  );
}

/** Ürün detay sayfası yerleşimini taklit eden skeleton */
export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-4/5" />
          <Skeleton className="h-5 w-24" />
          <div className="flex gap-3">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-28" />
          </div>
          <Skeleton className="h-5 w-32" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-5 w-20 mt-2" />
          <Skeleton className="h-12 w-40 rounded-2xl mt-6" />
        </div>
      </div>
    </div>
  );
}
