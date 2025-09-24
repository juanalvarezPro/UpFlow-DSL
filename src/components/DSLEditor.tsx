'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useDSLEditorView } from '@/hooks/views/useDSLEditor.view';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

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
  const { handleEditorDidMount, handleFormat } = useDSLEditorView({ onFormat: onFormat || (() => { }) });

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
      <MonacoEditor
        height="100%"
        language="flows-dsl"
        value={value}
        onChange={(newValue) => onChange(newValue || '')}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 15,
          lineNumbers: 'on',
          wordWrap: 'on',
          automaticLayout: true,
          fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
          lineHeight: 1.6,
          padding: { top: 16, bottom: 16 },
          cursorStyle: 'line',
          renderLineHighlight: 'line',
          mouseWheelZoom: true,
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
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
