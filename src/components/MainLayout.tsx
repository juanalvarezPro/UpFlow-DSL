'use client';

import { DSLEditor } from './DSLEditor';
import { JSONPreview } from './JSONPreview';
import { useDSLEditor } from '@/hooks/useDSLEditor';
import { GitHubStarsButton } from './ui/GitHubStarsButton';
import { Footer } from './ui/Footer';

export function MainLayout() {
  const { dslValue, handleDSLChange, handleFormat, jsonData, isValid, error } = useDSLEditor();
  
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
              <p className="hidden sm:block text-sm text-slate-300/80">
                Crea Flows de Whatsapp Meta con sintaxis natural
              </p>
            </div>
            
            <GitHubStarsButton 
              repoUrl="https://github.com/juanalvarezPro/UpFlow-DSL"
            />
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
    </div>
  );
}
