'use client';

import { DSLEditor } from './DSLEditor';
import { JSONPreview } from './JSONPreview';
import { useDSLEditor } from '@/hooks/useDSLEditor';
import { GitHubStarsButton } from './ui/GitHubStarsButton';
import { Footer } from './ui/Footer';
import { AutoSaveIndicator } from './ui/AutoSaveIndicator';
import { Button } from './ui/button';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export function MainLayout() {
  const { dslValue, handleDSLChange, handleFormat, jsonData, isValid, error, warnings, isAutoSaving, lastSaved, hasUnsavedChanges } = useDSLEditor();
  const [showClearDialog, setShowClearDialog] = useState(false);
  
  const handleClearDSL = () => {
    setShowClearDialog(true);
  };

  const confirmClearDSL = () => {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem('upflows_dsl_content');
      toast.success('DSL limpiado correctamente');
      window.location.reload(); // Recargar para resetear todo
    }
  };
  
  return (
    <div className="h-screen flex flex-col bg-blue-blur relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="glass-strong border-b border-blue-500/20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                <h1 className="text-xl font-bold text-gradient">
                  UpFlows! DSL
                </h1>
              </div>
              <div className="hidden sm:flex flex-col">
                <p className="text-sm text-slate-300/80">
                  Crea Flows de Whatsapp Meta con sintaxis natural
                </p>
                {error ? (
                  <div className="text-red-400 text-sm font-medium">
                    No se puede guardar: hay errores de sintaxis
                  </div>
                ) : (
                  <AutoSaveIndicator 
                    isAutoSaving={isAutoSaving}
                    lastSaved={lastSaved}
                    hasUnsavedChanges={hasUnsavedChanges}
                  />
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearDSL}
                className="flex items-center gap-2 text-slate-300 hover:text-slate-100 hover:bg-red-500/10 border border-red-500/20 hover:border-red-400/30 transition-all duration-200 rounded-lg"
                title="Limpiar DSL guardado"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline text-sm font-medium">Limpiar</span>
              </Button>
              
              <GitHubStarsButton 
                repoUrl="https://github.com/juanalvarezPro/UpFlow-DSL"
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex flex-col lg:flex-row p-4 gap-4 relative z-10 min-h-0">
        {/* Editor DSL */}
        <div className="flex-1 min-h-0">
          <DSLEditor
            value={dslValue}
            onChange={handleDSLChange}
            error={error}
            warnings={warnings}
            onFormat={handleFormat}
          />
        </div>
        
        {/* JSON Preview */}
        <div className="flex-1 min-h-0">
          <JSONPreview
            data={jsonData}
            isValid={isValid}
          />
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Clear DSL Confirmation Dialog */}
      <ConfirmDialog
        open={showClearDialog}
        onOpenChange={setShowClearDialog}
        onConfirm={confirmClearDSL}
        title="Limpiar contenido DSL"
        description="¿Estás seguro de que quieres limpiar todo el contenido guardado? Esto eliminará el DSL actual y volverá al contenido por defecto."
        confirmText="Limpiar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
}
