'use client';

export function MetaPlaygroundSkeleton() {
  return (
    <div className="h-full bg-blue-blur flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/6 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header skeleton */}
      <div className="glass-strong border-b border-blue-500/20 px-4 py-3 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-400/50 rounded-full shadow-lg shadow-blue-400/30 animate-pulse"></div>
          <div className="h-4 w-24 bg-slate-600/50 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-slate-600/50 rounded-lg animate-pulse"></div>
          <div className="h-8 w-8 bg-slate-600/50 rounded-lg animate-pulse"></div>
          <div className="h-8 w-8 bg-slate-600/50 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 p-3 sm:p-4 lg:p-6 flex justify-center relative z-0 overflow-hidden">
        <div className="w-full max-w-xs sm:max-w-sm h-full flex flex-col">
          {/* WhatsApp-like interface skeleton */}
          <div className="glass rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full">
            {/* WhatsApp header skeleton */}
            <div className="bg-gradient-to-r from-blue-600/50 to-blue-700/50 px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 bg-slate-600/50 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-slate-600/50 rounded animate-pulse"></div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400/50 rounded-full animate-pulse"></div>
                  <div className="h-3 w-16 bg-slate-600/50 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="h-5 w-5 bg-slate-600/50 rounded animate-pulse"></div>
            </div>

            {/* Content area skeleton */}
            <div className="flex-1 overflow-y-auto bg-slate-50/10 backdrop-blur-sm">
              <div className="p-4 space-y-4 pb-6">
                {/* Title skeleton */}
                <div className="h-6 w-48 bg-slate-600/50 rounded animate-pulse mx-auto"></div>
                
                {/* Text content skeleton */}
                <div className="space-y-2">
                  <div className="h-4 w-full bg-slate-600/50 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-slate-600/50 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-slate-600/50 rounded animate-pulse"></div>
                </div>

                {/* Image placeholder skeleton */}
                <div className="bg-gradient-to-br from-blue-400/20 to-blue-500/20 backdrop-blur-sm rounded-lg border border-blue-500/20 h-32 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 bg-slate-600/50 rounded animate-pulse"></div>
                    <div className="h-3 w-24 bg-slate-600/50 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Form skeleton */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-slate-600/50 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-slate-600/50 rounded-lg animate-pulse"></div>
                  </div>
                  
                  {/* Button skeleton */}
                  <div className="pt-2">
                    <div className="h-12 w-full bg-slate-600/50 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer skeleton */}
            <div className="px-4 py-3 bg-slate-50/10 backdrop-blur-md border-t border-blue-500/20 flex-shrink-0 h-16 flex items-center justify-center">
              <div className="h-3 w-48 bg-slate-600/50 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile footer skeleton */}
      <div className="lg:hidden glass-strong border-t border-blue-500/20 px-4 py-3 relative z-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-2 h-2 bg-blue-400/50 rounded-full shadow-lg shadow-blue-400/30 animate-pulse flex-shrink-0"></div>
            <div className="h-4 w-24 bg-slate-600/50 rounded animate-pulse"></div>
            <div className="h-3 w-8 bg-slate-600/50 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="h-8 w-20 bg-slate-600/50 rounded-lg animate-pulse"></div>
            <div className="h-8 w-20 bg-slate-600/50 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Navigation dots skeleton */}
      <div className="flex justify-center mt-4 space-x-2 relative z-0">
        <div className="w-2 h-2 bg-blue-400/50 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-slate-400/60 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-slate-400/60 rounded-full animate-pulse"></div>
      </div>

      {/* Loading indicator */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-20">
        <div className="bg-slate-800/90 rounded-lg p-6 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin"></div>
          <div className="text-slate-300 text-sm font-medium">Cargando vista previa...</div>
        </div>
      </div>
    </div>
  );
}
