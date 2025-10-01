'use client';

export function CodeSkeleton() {
  return (
    <div className="h-full bg-slate-950/30 p-3 sm:p-4 lg:p-6 overflow-auto">
      <div className="space-y-3">
        {/* JSON structure skeleton with proper indentation */}
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 bg-slate-600/30 rounded animate-pulse flex-shrink-0 mt-0.5"></div>
          <div className="h-4 w-16 bg-slate-600/30 rounded animate-pulse"></div>
          <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
        </div>
        
        <div className="ml-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-20 bg-slate-600/30 rounded animate-pulse"></div>
            <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-slate-600/30 rounded animate-pulse"></div>
            <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 bg-slate-600/30 rounded animate-pulse"></div>
            <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-slate-600/30 rounded animate-pulse"></div>
            <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 bg-slate-600/30 rounded animate-pulse"></div>
            <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
            <div className="h-4 w-28 bg-slate-600/30 rounded animate-pulse"></div>
            <div className="h-4 w-2 bg-slate-600/30 rounded animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 bg-slate-600/30 rounded animate-pulse flex-shrink-0 mt-0.5"></div>
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
        
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 bg-slate-600/30 rounded animate-pulse flex-shrink-0 mt-0.5"></div>
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
        
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 bg-slate-600/30 rounded animate-pulse flex-shrink-0 mt-0.5"></div>
        </div>
        
        {/* Loading indicator */}
        <div className="flex items-center justify-center mt-6">
          <div className="inline-flex items-center gap-2 text-slate-400 text-sm">
            <div className="w-4 h-4 border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin"></div>
            <span>Generando JSON...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
