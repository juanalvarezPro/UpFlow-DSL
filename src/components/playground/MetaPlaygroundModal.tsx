import React from 'react';
import { Button } from '../ui/button';
import { X, Play, Pause, ChevronDown} from 'lucide-react';
import { MetaPlaygroundContent } from './MetaPlaygroundContent';
import { Screen } from './types';

interface MetaPlaygroundModalProps {
  showMobileModal: boolean;
  currentScreen: Screen;
  isPlaying: boolean;
  formData: { [key: string]: string };
  isFormComplete: boolean;
  processedData: { screens: { title: string }[] } | null;
  currentScreenIndex: number;
  showScreenOptions: boolean;
  onClose: () => void;
  onFormChange: (name: string, value: string) => void;
  onContinue: () => void;
  onTogglePlay: () => void;
  onSetShowScreenOptions: (show: boolean) => void;
  onSetCurrentScreenIndex: (index: number) => void;
}

export function MetaPlaygroundModal({
  showMobileModal,
  currentScreen,
  isPlaying,
  formData,
  isFormComplete,
  processedData,
  currentScreenIndex,
  showScreenOptions,
  onClose,
  onFormChange,
  onContinue,
  onTogglePlay,
  onSetShowScreenOptions,
}: MetaPlaygroundModalProps) {
  if (!showMobileModal) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 lg:hidden">
      <div className="w-full max-w-sm h-[80vh] flex flex-col">
        {/* Header del modal */}
        <div className="glass-strong border-b border-blue-500/20 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
            <h2 className="text-sm font-semibold text-white">Preview del Flujo</h2>
            {isPlaying && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-200 font-medium">Ejecutando</span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-300 hover:text-white hover:bg-red-500/20 border border-red-500/20 p-1.5"
            title="Cerrar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Contenido del modal */}
        <div className="flex-1 overflow-hidden">
          {/* Mockup del teléfono */}
          <div className="h-full flex justify-center items-center p-4">
            <div className="w-full max-w-xs h-full flex flex-col">
              <MetaPlaygroundContent
                currentScreen={currentScreen}
                isPlaying={isPlaying}
                formData={formData}
                isFormComplete={isFormComplete}
                onFormChange={onFormChange}
                onContinue={onContinue}
              />
            </div>
          </div>
        </div>

        {/* Footer del modal con controles */}
        <div className="glass-strong border-t border-blue-500/20 px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between gap-3">
            {/* Información de pantalla */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50 flex-shrink-0"></div>
              <span className="text-sm text-white truncate">
                {Array.isArray(processedData?.screens) && processedData.screens[currentScreenIndex]?.title
                  ? processedData.screens[currentScreenIndex].title
                  : `Pantalla ${currentScreenIndex + 1}`}
              </span>
              {Array.isArray(processedData?.screens) && processedData.screens.length > 1 && (
                <span className="text-xs text-slate-400">
                  {currentScreenIndex + 1}/{processedData.screens.length}
                </span>
              )}
            </div>
            
            {/* Controles del modal */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={onTogglePlay}
                className={`flex items-center gap-2 px-3 py-2 ${
                  isPlaying 
                    ? 'text-green-400 bg-green-500/20 border border-green-500/30' 
                    : 'text-slate-300 hover:text-white hover:bg-blue-500/20 border border-blue-500/20'
                }`}
                title={isPlaying ? "Pausar" : "Ejecutar"}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span className="text-sm font-medium">
                  {isPlaying ? "Pausar" : "Ejecutar"}
                </span>
              </Button>
              
              {processedData && processedData.screens.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSetShowScreenOptions(!showScreenOptions)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-blue-500/20 border border-blue-500/20"
                  title="Seleccionar pantalla"
                >
                  <ChevronDown className="h-4 w-4" />
                  <span className="text-sm font-medium">Pantallas</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
