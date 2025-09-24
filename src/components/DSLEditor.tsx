'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useDSLEditorView } from '@/hooks/views/useDSLEditor.view';
import { MonacoEditorView } from './monacoEditor';

interface DSLEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: {
    message: string;
    location: {
      start: { line: number; column: number };
      end: { line: number; column: number };
    };
  } | null;
  onFormat?: () => void;
}

export function DSLEditor({ value, onChange, error, onFormat }: DSLEditorProps) {
  const { handleEditorDidMount, handleFormat } = useDSLEditorView({ onFormat: onFormat || (() => { }), registerNameEditor: 'flows-dsl' });

  return (
    <div className="h-full flex flex-col bg-slate-900 border border-slate-700  shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <h2 className="text-sm font-medium text-slate-200">Editor DSL</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFormat}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="text-sm">Formatear</span>
        </Button>
      </div>

      {/* Editor */}
      <div className="flex-1 relative overflow-hidden">
        <MonacoEditorView value={value} onChange={onChange} handleEditorDidMount={handleEditorDidMount} />
      </div>

      {/* Error */}
      {error && (
        <div className="px-6 py-3 bg-red-900/20 border-t border-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <div className="text-sm font-medium text-red-300">Error de sintaxis</div>
              <div className="text-sm text-red-200">{error.message}</div>
              <div className="text-xs text-red-400">
                Línea {error.location.start.line}, columna {error.location.start.column}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
