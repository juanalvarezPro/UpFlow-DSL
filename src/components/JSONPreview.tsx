'use client';

import { useJSONPreview } from '@/hooks/views/useJSON.preview';
import { CopyButton } from './ui/CopyButton';

interface JSONPreviewProps {
  data: unknown;
  isValid: boolean;
}

export function JSONPreview({ data, isValid }: JSONPreviewProps) {
  const { handleCopy, formatJSON, copied } = useJSONPreview({ data });

  return (
    <div className="h-full flex flex-col bg-slate-900 border border-slate-700 shadow-lg overflow-hidden">
      {/* Header minimalista */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isValid ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <h2 className="text-sm font-medium text-slate-200">JSON Generado</h2>
          <span className={`text-xs px-2 py-1 rounded ${isValid ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
            {isValid ? "Válido" : "Inválido"}
          </span>
        </div>
        <CopyButton handleCopy={handleCopy} isValid={isValid} copied={copied} />
      </div>

      {/* JSON Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full bg-slate-950 p-6 overflow-auto">
          <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
            {isValid ? formatJSON(data) : '// Error: No se puede generar JSON válido'}
          </pre>
        </div>
      </div>
    </div>
  );
}
