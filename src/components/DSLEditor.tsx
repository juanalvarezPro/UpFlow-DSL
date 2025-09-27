'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { useDSLEditorView } from '@/hooks/views/useDSLEditor.view';
import { ValidationWarning } from '@/lib/validation';
import { ImageUpload } from '@/components/ui/ImageUpload';
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
  warnings?: ValidationWarning[] | null;
  onFormat?: () => void;
}

export function DSLEditor({ value, onChange, error, warnings, onFormat }: DSLEditorProps) {
  const { handleEditorDidMount, handleFormat, handleImageUpload, handleImageCancel, showImageUpload, setShowImageUpload } = useDSLEditorView({ onFormat: onFormat || (() => { }), onChange: onChange });
  

  return (
    <div className="h-full flex flex-col glass rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-blue-500/20 glass-subtle flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
          <h2 className="text-sm font-semibold text-slate-200">Editor DSL</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowImageUpload(true)}
            className="flex items-center gap-2 text-slate-300 hover:text-slate-100 hover:bg-blue-500/10 border border-blue-500/20 hover:border-blue-400/30 transition-all duration-200 rounded-lg"
          >
            <ImageIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Imagen</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFormat}
            className="flex items-center gap-2 text-slate-300 hover:text-slate-100 hover:bg-blue-500/10 border border-blue-500/20 hover:border-blue-400/30 transition-all duration-200 rounded-lg"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="text-sm font-medium">Formatear</span>
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0 relative">
        <MonacoEditor
          height="100%"
          language="flows-dsl"
          value={value}
          onChange={(newValue) => onChange(newValue || '')}
          onMount={(editor, monaco) => {
            // Configurar tema personalizado más cómodo
            monaco.editor.defineTheme('upflows-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [
                { token: 'comment', foreground: '64748B', fontStyle: 'italic' },
                { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
                { token: 'string', foreground: 'CE9178' },
                { token: 'number', foreground: 'B5CEA8' },
                { token: 'operator', foreground: 'D4D4D4' },
                { token: 'delimiter', foreground: 'D4D4D4' },
                { token: 'identifier', foreground: '9CDCFE' },
                { token: 'type', foreground: '4EC9B0' },
                { token: 'function', foreground: 'DCDCAA' },
                { token: 'variable', foreground: '9CDCFE' },
                { token: 'constant', foreground: '4FC1FF' },
                { token: 'property', foreground: '9CDCFE' },
                { token: 'punctuation', foreground: 'D4D4D4' },
              ],
              colors: {
                'editor.background': '#0F172A',
                'editor.foreground': '#E2E8F0',
                'editor.lineHighlightBackground': '#1E293B40',
                'editor.selectionBackground': '#3B82F640',
                'editor.inactiveSelectionBackground': '#3B82F620',
                'editorCursor.foreground': '#3B82F6',
                'editor.lineHighlightBorder': '#1E293B60',
                'editorLineNumber.foreground': '#64748B',
                'editorLineNumber.activeForeground': '#94A3B8',
                'editorIndentGuide.background': '#1E293B40',
                'editorIndentGuide.activeBackground': '#3B82F640',
                'editorBracketMatch.background': '#3B82F620',
                'editorBracketMatch.border': '#3B82F6',
                'scrollbarSlider.background': '#3B82F630',
                'scrollbarSlider.hoverBackground': '#3B82F650',
                'scrollbarSlider.activeBackground': '#3B82F670',
              }
            });

            editor.updateOptions({
              theme: 'upflows-dark'
            });

            handleEditorDidMount(editor, monaco);
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            lineNumbers: 'on',
            wordWrap: 'on',
            automaticLayout: true,
            fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
            lineHeight: 1.6,
            padding: { top: 20, bottom: 20 },
            cursorStyle: 'line',
            renderLineHighlight: 'line',
            mouseWheelZoom: true,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
            suggest: {
              showKeywords: true,
              showSnippets: true,
            },
          }}
        />
      </div>

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="px-6 py-4 bg-yellow-950/30 border-t border-yellow-500/20 glass-subtle flex-shrink-0">
          <div className="space-y-3">
            {warnings.map((warning, index) => (
              <div key={index} className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1 min-w-0">
                  <div className="text-sm font-medium text-yellow-300">Advertencia</div>
                  <div className="text-sm text-yellow-200 break-words">{warning.message}</div>
                  <div className="text-xs text-yellow-400">
                    Línea {warning.location.start.line}, columna {warning.location.start.column}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-6 py-4 bg-red-950/30 border-t border-red-500/20 glass-subtle flex-shrink-0">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1 min-w-0">
              <div className="text-sm font-medium text-red-300">Error de sintaxis</div>
              <div className="text-sm text-red-200 break-words">{error.message}</div>
              <div className="text-xs text-red-400">
                Línea {error.location.start.line}, columna {error.location.start.column}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {showImageUpload && (
        <ImageUpload
          onImageUpload={handleImageUpload}
          onCancel={handleImageCancel}
        />
      )}
    </div>
  );
}
