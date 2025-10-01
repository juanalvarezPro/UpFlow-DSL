export function DSLEditorSkeleton() {
  return (
    <div className="flex-1 min-h-0 bg-[#0F172A] relative">
      {/* Simular líneas de código con colores del tema */}
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse"></div>
          <div className="w-16 h-3 bg-[#1E293B] rounded animate-pulse"></div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-[#64748B] rounded"></div>
            <div className="w-20 h-3 bg-[#1E293B] rounded animate-pulse"></div>
            <div className="w-12 h-3 bg-[#64748B] rounded"></div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <div className="w-16 h-3 bg-[#64748B] rounded"></div>
            <div className="w-8 h-3 bg-[#1E293B] rounded animate-pulse"></div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <div className="w-10 h-3 bg-[#64748B] rounded"></div>
            <div className="w-24 h-3 bg-[#1E293B] rounded animate-pulse"></div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-[#64748B] rounded"></div>
            <div className="w-14 h-3 bg-[#1E293B] rounded animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Indicador de carga */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[#64748B]">
        <div className="w-3 h-3 border border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs">Cargando...</span>
      </div>
    </div>
  );
}