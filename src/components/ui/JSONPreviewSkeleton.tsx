'use client';

export function JSONPreviewSkeleton() {
  return (
    <div className="h-full flex flex-col glass rounded-xl overflow-hidden">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-blue-500/20 glass-subtle flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-2 h-2 bg-green-400/50 rounded-full shadow-lg shadow-green-400/30 flex-shrink-0 animate-pulse"></div>
          <div className="h-4 w-24 bg-slate-600/50 rounded animate-pulse"></div>
          <div className="h-6 w-16 bg-slate-600/50 rounded-lg animate-pulse"></div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-800/50 rounded-lg p-0.5 sm:p-1">
            <div className="h-6 w-16 bg-slate-600/50 rounded animate-pulse"></div>
            <div className="h-6 w-12 bg-slate-600/50 rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-16 bg-slate-600/50 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full bg-slate-950/30 p-3 sm:p-4 lg:p-6">
          {/* Simulate JSON structure */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-slate-600/30 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-slate-600/30 rounded animate-pulse"></div>
              <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
            </div>
            <div className="ml-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-16 bg-slate-600/30 rounded animate-pulse"></div>
                <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-slate-600/30 rounded animate-pulse"></div>
                <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-12 bg-slate-600/30 rounded animate-pulse"></div>
                <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-slate-600/30 rounded animate-pulse"></div>
                <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-20 bg-slate-600/30 rounded animate-pulse"></div>
                <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
                <div className="h-4 w-28 bg-slate-600/30 rounded animate-pulse"></div>
                <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-slate-600/30 rounded animate-pulse"></div>
            </div>
            <div className="ml-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-16 bg-slate-600/30 rounded animate-pulse"></div>
                <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-slate-600/30 rounded animate-pulse"></div>
                <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-12 bg-slate-600/30 rounded animate-pulse"></div>
                <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-slate-600/30 rounded animate-pulse"></div>
                <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-slate-600/30 rounded animate-pulse"></div>
            </div>
            <div className="ml-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-20 bg-slate-600/30 rounded animate-pulse"></div>
                <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-slate-600/30 rounded animate-pulse"></div>
                <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-16 bg-slate-600/30 rounded animate-pulse"></div>
                <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
                <div className="h-4 w-28 bg-slate-600/30 rounded animate-pulse"></div>
                <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-slate-600/30 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
