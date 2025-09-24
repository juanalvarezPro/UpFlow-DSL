'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface JSONPreviewProps {
  data: unknown;
  isValid: boolean;
}

export function JSONPreview({ data, isValid }: JSONPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  };

  const formatJSON = (obj: unknown, indent: number = 0): string => {
    if (obj === null) return 'null';
    if (typeof obj === 'string') return `"${obj}"`;
    if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      const items = obj.map(item => 
        '  '.repeat(indent + 1) + formatJSON(item, indent + 1)
      ).join(',\n');
      return `[\n${items}\n${'  '.repeat(indent)}]`;
    }
    
    if (typeof obj === 'object') {
      const entries = Object.entries(obj);
      if (entries.length === 0) return '{}';
      
      const items = entries.map(([key, value]) => 
        '  '.repeat(indent + 1) + `"${key}": ${formatJSON(value, indent + 1)}`
      ).join(',\n');
      
      return `{\n${items}\n${'  '.repeat(indent)}}`;
    }
    
    return String(obj);
  };

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
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          disabled={!isValid}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span className="text-sm">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span className="text-sm">Copiar</span>
            </>
          )}
        </Button>
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
