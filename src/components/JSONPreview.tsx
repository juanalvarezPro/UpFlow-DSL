'use client';

import { useJSONPreview } from '@/hooks/views/useJSON.preview';
import { CopyButton } from './ui/CopyButton';
import { MetaPlaygroundMockup } from './playground/MetaPlaygroundMockup';
import { useState } from 'react';
import { Eye, Code } from 'lucide-react';
import { Button } from './ui/button';

interface JSONPreviewProps {
  data: unknown;
  isValid: boolean;
  error?: string | null;
}

export function JSONPreview({ data, isValid, error }: JSONPreviewProps) {
  const { handleCopy, formatJSONWithTooltips, copied, isConverting } = useJSONPreview({ data });
  const [viewMode, setViewMode] = useState<'json' | 'preview'>('preview');

  return (
    <div className="h-full flex flex-col glass rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-blue-500/20 glass-subtle flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className={`w-2 h-2 rounded-full shadow-lg flex-shrink-0 ${isValid ? 'bg-green-400 shadow-green-400/50' : 'bg-red-400 shadow-red-400/50'}`}></div>
          <h2 className="text-sm font-semibold text-slate-200 truncate">
            {viewMode === 'preview' ? 'Vista Previa' : 'JSON Generado'}
          </h2>
          <span className={`text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-medium glass-subtle border flex-shrink-0 ${isValid ? 'text-green-300 border-green-500/30' : 'text-red-300 border-red-500/30'}`}>
            {isConverting ? "Convirtiendo..." : (isValid ? "Válido" : "Inválido")}
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-800/50 rounded-lg p-0.5 sm:p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('preview')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs ${viewMode === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
            >
              <Eye className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline">Preview</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('json')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs ${viewMode === 'json' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
            >
              <Code className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline">JSON</span>
            </Button>
          </div>
          {viewMode === 'json' && <CopyButton handleCopy={handleCopy} isValid={isValid} copied={copied} />}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {viewMode === 'preview' ? (
          <MetaPlaygroundMockup dslData={data} error={error} isValid={isValid} />
        ) : (
          <div className="h-full bg-slate-950/30 p-3 sm:p-4 lg:p-6 overflow-auto">
            <div className="json-preview-container text-xs sm:text-sm font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
              {isValid ? formatJSONWithTooltips(data) : '// Error: No se puede generar JSON válido'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
