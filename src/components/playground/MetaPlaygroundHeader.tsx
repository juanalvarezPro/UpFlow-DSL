import React from 'react';
import { Button } from '../ui/button';
import { Smartphone, Play, Pause, RotateCcw, Code, Download, Loader2, ChevronDown } from 'lucide-react';

interface MetaPlaygroundHeaderProps {
  error?: string | null;
  isValid?: boolean;
  processedData: any;
  currentScreenIndex: number;
  isPlaying: boolean;
  copied: boolean;
  isExporting: boolean;
  showScreenOptions: boolean;
  onTogglePlay: () => void;
  onResetPreview: () => void;
  onCopyJSON: () => Promise<void>;
  onExport: () => Promise<void>;
  onShowMobileModal: () => void;
  onSetShowScreenOptions: (show: boolean) => void;
  onSetCurrentScreenIndex: (index: number) => void;
}

export function MetaPlaygroundHeader({
  error,
  isValid,
  processedData,
  currentScreenIndex,
  isPlaying,
  copied,
  isExporting,
  showScreenOptions,
  onTogglePlay,
  onResetPreview,
  onCopyJSON,
  onExport,
  onShowMobileModal,
  onSetShowScreenOptions,
  onSetCurrentScreenIndex,
}: MetaPlaygroundHeaderProps) {
  return (
    <div className="glass-strong border-b border-blue-500/20 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between relative z-10">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <div className={`w-2 h-2 rounded-full shadow-lg flex-shrink-0 ${
          error || !isValid 
            ? 'bg-red-400 shadow-red-400/50' 
            : 'bg-blue-400 shadow-blue-400/50'
        }`}></div>
        <div className="text-white text-xs sm:text-sm font-medium truncate">
          {error || !isValid ? 'Error en el DSL' : 'Vista Previa Interactiva'}
        </div>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {/* Botón de modal para móviles */}
        {!error && isValid && processedData && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowMobileModal}
            className="text-slate-300 hover:text-white hover:bg-blue-500/20 border border-blue-500/20 p-1.5 sm:p-2 lg:hidden"
            title="Ver preview en pantalla completa"
          >
            <Smartphone className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        )}
        
        {/* Botones de control - solo en desktop */}
        {!error && isValid && processedData && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={onTogglePlay}
              className="hidden lg:flex text-slate-300 hover:text-white hover:bg-blue-500/20 border border-blue-500/20 p-1.5 sm:p-2"
              title={isPlaying ? "Pausar" : "Ejecutar"}
            >
              {isPlaying ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetPreview}
              className="hidden lg:flex text-slate-300 hover:text-white hover:bg-blue-500/20 border border-blue-500/20 p-1.5 sm:p-2"
              title="Reiniciar"
            >
              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </>
        )}
        
        {/* Botón de opciones de pantallas - solo en desktop */}
        {!error && isValid && processedData && processedData.screens.length > 1 && (
          <div className="relative dropdown-container hidden lg:block">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSetShowScreenOptions(!showScreenOptions)}
              className="text-slate-300 hover:text-white hover:bg-blue-500/20 border border-blue-500/20 flex items-center gap-1 sm:gap-2 px-2 sm:px-3"
              title="Seleccionar pantalla"
            >
              <span className="text-xs truncate max-w-20 sm:max-w-none">
                {processedData.screens[currentScreenIndex]?.title || `Pantalla ${currentScreenIndex + 1}`}
              </span>
              <ChevronDown className="h-3 w-3 flex-shrink-0" />
            </Button>
            
            {showScreenOptions && (
              <div className="absolute top-full right-0 mt-1 w-48 sm:w-64 bg-slate-900/95 backdrop-blur-md border border-blue-500/30 rounded-lg shadow-2xl z-[100]">
                <div className="p-2">
                  <div className="text-xs text-blue-300 mb-2 px-2 font-medium">Seleccionar pantalla:</div>
                  {processedData.screens.map((screen: { id: string; title: string }, index: number) => (
                    <button
                      key={screen.id}
                      onClick={() => {
                        onSetCurrentScreenIndex(index);
                        onSetShowScreenOptions(false);
                      }}
                      className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm transition-colors ${
                        index === currentScreenIndex
                          ? 'bg-blue-600/40 text-white border border-blue-500/30'
                          : 'text-slate-200 hover:text-white hover:bg-blue-500/20 border border-transparent'
                      }`}
                    >
                      <div className="font-medium truncate">{screen.title}</div>
                      <div className="text-xs text-blue-300">Pantalla {index + 1}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Botones de opciones - solo en desktop */}
        {!error && isValid && processedData && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCopyJSON}
              className={`hidden lg:flex border border-blue-500/20 p-1.5 sm:p-2 ${
                copied 
                  ? 'text-green-400 bg-green-500/20' 
                  : 'text-slate-300 hover:text-white hover:bg-blue-500/20'
              }`}
              title={copied ? "¡Copiado!" : "Copiar código"}
            >
              <Code className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onExport}
              disabled={isExporting || !processedData}
              className="hidden lg:flex text-slate-300 hover:text-white hover:bg-blue-500/20 border border-blue-500/20 disabled:opacity-50 p-1.5 sm:p-2"
              title="Exportar"
            >
              {isExporting ? (
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
              ) : (
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>
          </>
        )}
        
        <div className="glass-subtle rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2">
          <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 text-blue-300 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-white truncate">WhatsApp Business</span>
        </div>
      </div>
    </div>
  );
}
