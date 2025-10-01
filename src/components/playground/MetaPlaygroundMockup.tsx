'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Smartphone, Play, Pause } from 'lucide-react';
import { useMetaPlayground } from '../../hooks/playground/useMetaPlayground';
import { ProcessedScreen, useFormData } from '../../hooks/playground/useFormData';
import { MetaPlaygroundHeader } from './MetaPlaygroundHeader';
import { MetaPlaygroundContent } from './MetaPlaygroundContent';
import { MetaPlaygroundModal } from './MetaPlaygroundModal';
import { ErrorState } from './ErrorState';
import { useScreenNavigation } from '@/hooks/playground/useScreenNavigation';
import { Screen } from './types';
interface MetaPlaygroundMockupProps {
  dslData?: unknown;
  error?: string | null;
  isValid?: boolean;
}

export function MetaPlaygroundMockup({ dslData, error, isValid = true }: MetaPlaygroundMockupProps) {
  // Hooks principales
  const { state, actions, processedData, currentScreen } = useMetaPlayground(dslData, error, isValid);
  const { formData, handleFormChange, clearFormData, isFormComplete } = useFormData(currentScreen as unknown as ProcessedScreen);
  const { handleContinue } = useScreenNavigation(
    currentScreen as unknown as ProcessedScreen,
    processedData,
    state.currentScreenIndex,
    actions.setCurrentScreenIndex,
    clearFormData
  );

  return (
    <div className="h-full bg-blue-blur flex flex-col relative overflow-hidden">
      {/* Efectos de fondo glassmorphism coherentes con el proyecto */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/6 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-3/4 left-1/3 w-72 h-72 bg-blue-500/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '6s' }}></div>
      </div>

      {/* Header del Preview */}
      <MetaPlaygroundHeader
        error={error}
        isValid={isValid}
        processedData={processedData}
        currentScreenIndex={state.currentScreenIndex}
        isPlaying={state.isPlaying}
        copied={state.copied}
        isExporting={state.isExporting}
        showScreenOptions={state.showScreenOptions}
        onTogglePlay={actions.togglePlay}
        onResetPreview={actions.resetPreview}
        onCopyJSON={actions.copyJSONToClipboard}
        onExport={actions.handleExport}
        onShowMobileModal={() => actions.setShowMobileModal(true)}
        onSetShowScreenOptions={actions.setShowScreenOptions}
        onSetCurrentScreenIndex={actions.setCurrentScreenIndex}
      />

      {/* Contenido Principal */}
      <div className="flex-1 p-3 sm:p-4 lg:p-6 flex justify-center relative z-0 overflow-hidden">
        <div className="w-full max-w-xs sm:max-w-sm h-full flex flex-col">
          {/* Estado de error o sin datos */}
          {error || !isValid || !processedData ? (
            <ErrorState error={error} isValid={isValid} />
          ) : (
            <MetaPlaygroundContent
              currentScreen={currentScreen as unknown as Screen}
              isPlaying={state.isPlaying}
              formData={formData}
              isFormComplete={isFormComplete}
              onFormChange={handleFormChange}
              onContinue={handleContinue}
            />
          )}
        </div>
      </div>

      {/* Footer con controles para móviles */}
      {!error && isValid && processedData && (
        <div className="lg:hidden glass-strong border-t border-blue-500/20 px-4 py-3 relative z-10">
          <div className="flex items-center justify-between gap-3">
            {/* Información de pantalla */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50 flex-shrink-0"></div>
              <span className="text-sm text-white truncate">
                {processedData.screens[state.currentScreenIndex]?.title || `Pantalla ${state.currentScreenIndex + 1}`}
              </span>
              {processedData.screens.length > 1 && (
                <span className="text-xs text-slate-400">
                  {state.currentScreenIndex + 1}/{processedData.screens.length}
                </span>
              )}
            </div>
            
            {/* Controles móviles */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={actions.togglePlay}
                className={`flex items-center gap-2 px-3 py-2 ${
                  state.isPlaying 
                    ? 'text-green-400 bg-green-500/20 border border-green-500/30' 
                    : 'text-slate-300 hover:text-white hover:bg-blue-500/20 border border-blue-500/20'
                }`}
                title={state.isPlaying ? "Pausar" : "Ejecutar"}
              >
                {state.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span className="text-sm font-medium">
                  {state.isPlaying ? "Pausar" : "Ejecutar"}
                </span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => actions.setShowMobileModal(true)}
                className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-blue-500/20 border border-blue-500/20"
                title="Ver preview"
              >
                <Smartphone className="h-4 w-4" />
                <span className="text-sm font-medium">Preview</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Indicadores de navegación */}
      {!error && isValid && processedData && (
        <div className="flex justify-center mt-4 space-x-2 relative z-0">
          {processedData.screens.map((_: unknown, index: number) => (
          <div 
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === state.currentScreenIndex 
                ? 'bg-blue-400 shadow-lg shadow-blue-400/50' 
                : 'bg-slate-400/60'
            }`}
          ></div>
        ))}
        </div>
      )}

      {/* Modal para móviles */}
      <MetaPlaygroundModal
        showMobileModal={state.showMobileModal}
        currentScreen={currentScreen as unknown as Screen}
        isPlaying={state.isPlaying}
        formData={formData}
        isFormComplete={isFormComplete}
        processedData={processedData}
        currentScreenIndex={state.currentScreenIndex}
        showScreenOptions={state.showScreenOptions}
        onClose={() => actions.setShowMobileModal(false)}
        onFormChange={handleFormChange}
        onContinue={handleContinue}
        onTogglePlay={actions.togglePlay}
        onSetShowScreenOptions={actions.setShowScreenOptions}
        onSetCurrentScreenIndex={actions.setCurrentScreenIndex}
      />
    </div>
  );
}
