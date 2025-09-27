'use client';

import { useJSONPreview } from '@/hooks/views/useJSON.preview';
import { CopyButton } from './ui/CopyButton';

interface JSONPreviewProps {
  data: unknown;
  isValid: boolean;
}

export function JSONPreview({ data, isValid }: JSONPreviewProps) {
  const { handleCopy, formatJSON, formatJSONWithTooltips, copied, isConverting } = useJSONPreview({ data });

  return (
    <div className="h-full flex flex-col glass rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-blue-500/20 glass-subtle flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full shadow-lg ${isValid ? 'bg-green-400 shadow-green-400/50' : 'bg-red-400 shadow-red-400/50'}`}></div>
          <h2 className="text-sm font-semibold text-slate-200">JSON Generado</h2>
          <span className={`text-xs px-3 py-1.5 rounded-lg font-medium glass-subtle border ${isValid ? 'text-green-300 border-green-500/30' : 'text-red-300 border-red-500/30'}`}>
            {isConverting ? "Convirtiendo..." : (isValid ? "Válido" : "Inválido")}
          </span>
        </div>
        <CopyButton handleCopy={handleCopy} isValid={isValid} copied={copied} />
      </div>

      {/* JSON Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full bg-slate-950/30 p-6 overflow-auto">
          <div className="text-sm font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
            {isValid ? formatJSONWithTooltips(data) : '// Error: No se puede generar JSON válido'}
          </div>
        </div>
      </div>
    </div>
  );
}
