'use client';

import { DSLEditor } from './DSLEditor';
import { JSONPreview } from './JSONPreview';
import { useDSLEditor } from '@/hooks/useDSLEditor';

export function MainLayout() {
  const { dslValue, handleDSLChange, handleFormat, jsonData, isValid, error } = useDSLEditor();
  
  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      {/* Header simple */}
      <div className="bg-slate-900 border-b border-slate-700 px-6 py-4 flex-shrink-0">
        <h1 className="text-lg font-semibold text-slate-100">
          Flows DSL
        </h1>
        <p className="text-sm text-slate-400">
          Crea flujos conversacionales con sintaxis natural
        </p>
      </div>
      
      {/* Contenido principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor DSL */}
        <div className="flex-1 border-r border-slate-700 overflow-hidden">
          <DSLEditor
            value={dslValue}
            onChange={handleDSLChange}
            error={error}
            onFormat={handleFormat}
          />
        </div>
        
        {/* JSON Preview */}
        <div className="flex-1 overflow-hidden">
          <JSONPreview
            data={jsonData}
            isValid={isValid}
          />
        </div>
      </div>
    </div>
  );
}
