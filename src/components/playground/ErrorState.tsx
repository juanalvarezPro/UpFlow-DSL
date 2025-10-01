import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  error?: string | null;
  isValid?: boolean;
}

export function ErrorState({ error, isValid = true }: ErrorStateProps) {
  return (
    <div className="glass rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[400px] sm:min-h-[500px]">
      {/* Header de error */}
      <div className={`px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between flex-shrink-0 ${
        error || !isValid 
          ? 'bg-gradient-to-r from-red-600 to-red-700' 
          : 'bg-gradient-to-r from-slate-600 to-slate-700'
      }`}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0" />
          <h2 className="font-semibold text-white text-sm sm:text-base truncate">
            {error || !isValid ? 'Error en el DSL' : 'DSL vacío'}
          </h2>
        </div>
        <X className="h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0" />
      </div>

      {/* Contenido de error o sin datos */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col items-center justify-center space-y-4 sm:space-y-6">
        {/* Icono de error grande */}
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center ${
          error || !isValid 
            ? 'bg-red-500/20' 
            : 'bg-slate-500/20'
        }`}>
          <AlertTriangle className={`h-8 w-8 sm:h-10 sm:w-10 ${
            error || !isValid 
              ? 'text-red-400' 
              : 'text-slate-400'
          }`} />
        </div>
        
        {/* Mensaje principal */}
        <div className="text-center space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {error || !isValid ? '¡Ups! Te equivocaste!' : 'El DSL está vacío'}
          </h3>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base px-2">
            {error || !isValid 
              ? 'Revisa en nuestro compilador de sintaxis natural.'
              : 'Comienza escribiendo tu código DSL en el editor para ver la vista previa aquí.'
            }
          </p>
        </div>
        
        {/* Detalles del error */}
        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-red-300 mb-2">
                  🔍 Error
                </p>
                <p className="text-xs sm:text-sm text-red-200/90 break-words font-mono leading-relaxed">
                  {error}
                </p>
                <p className="text-xs text-red-300/70 mt-2">
                  💡 Este es el error exacto que encontró nuestro compilador de sintaxis natural
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer de error o sin datos */}
      <div className={`px-3 sm:px-4 py-2 sm:py-3 border-t flex-shrink-0 h-12 sm:h-16 flex items-center justify-center ${
        error || !isValid 
          ? 'bg-red-500/10 border-red-500/20' 
          : 'bg-slate-500/10 border-slate-500/20'
      }`}>
        <p className={`text-xs text-center px-2 ${
          error || !isValid 
            ? 'text-red-300' 
            : 'text-slate-300'
        }`}>
          {error || !isValid 
            ? 'Usa nuestro compilador de sintaxis natural para corregir el error'
            : 'Escribe tu código DSL para ver la vista previa aquí'
          }
        </p>
      </div>
    </div>
  );
}
