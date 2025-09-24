'use client';

import dynamic from 'next/dynamic';
import { useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import type * as monaco from 'monaco-editor';

// Import dinámico (desactiva SSR)
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
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = useCallback((editor: monaco.editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => {
    editorRef.current = editor;

    // Registrar lenguaje
    monaco.languages.register({ id: 'flows-dsl' });

    // Configurar comportamiento del teclado
    editor.addCommand(monaco.KeyCode.Enter, () => {
      const position = editor.getPosition();
      const model = editor.getModel();
      
      if (!position || !model) return;
      
      const lineContent = model.getLineContent(position.lineNumber);
      const beforeCursor = lineContent.substring(0, position.column - 1);
      
      // Si estamos después de "Opciones:", agregar bullet automáticamente
      if (beforeCursor.trim() === 'Opciones:') {
        editor.trigger('keyboard', 'type', { text: '\n• ' });
        return;
      }
      
      // Si estamos en una línea que termina con ":", agregar salto de línea
      if (beforeCursor.trim().endsWith(':')) {
        editor.trigger('keyboard', 'type', { text: '\n' });
        return;
      }
      
      // Si estamos en una línea vacía, verificar si estamos en una sección de opciones
      if (lineContent.trim() === '') {
        // Buscar hacia arriba para ver si hay una línea "Opciones:" reciente
        let foundOptions = false;
        for (let i = position.lineNumber - 1; i >= 1; i--) {
          const line = model.getLineContent(i).trim();
          if (line === 'Opciones:') {
            foundOptions = true;
            break;
          }
          // Si encontramos otra pantalla o sección, salir
          if (line.startsWith('Pantalla ') || line.startsWith('Mostramos:') || line.startsWith('Si eliges')) {
            break;
          }
        }
        
        if (foundOptions) {
          // No agregar bullet automáticamente, dejar que el usuario escriba
          editor.trigger('keyboard', 'type', { text: '\n' });
          return;
        }
      }
      
      // Comportamiento normal de Enter
      editor.trigger('keyboard', 'type', { text: '\n' });
    });

    editor.addCommand(monaco.KeyCode.Space, () => {
      const position = editor.getPosition();
      const model = editor.getModel();
      
      if (!position || !model) return;
      
      const lineContent = model.getLineContent(position.lineNumber);
      const beforeCursor = lineContent.substring(0, position.column - 1);
      
      // Si estamos después de "Opciones:", agregar bullet y espacio
      if (beforeCursor.trim() === 'Opciones:') {
        editor.trigger('keyboard', 'type', { text: '\n• ' });
        return;
      }
      
      // Si estamos en una línea vacía, verificar si estamos en una sección de opciones
      if (lineContent.trim() === '') {
        // Buscar hacia arriba para ver si hay una línea "Opciones:" reciente
        let foundOptions = false;
        for (let i = position.lineNumber - 1; i >= 1; i--) {
          const line = model.getLineContent(i).trim();
          if (line === 'Opciones:') {
            foundOptions = true;
            break;
          }
          // Si encontramos otra pantalla o sección, salir
          if (line.startsWith('Pantalla ') || line.startsWith('Mostramos:') || line.startsWith('Si eliges')) {
            break;
          }
        }
        
        if (foundOptions) {
          // No agregar bullet automáticamente, dejar que el usuario escriba
          editor.trigger('keyboard', 'type', { text: ' ' });
          return;
        }
      }
      
      // Comportamiento normal de Space
      editor.trigger('keyboard', 'type', { text: ' ' });
    });

    monaco.languages.setMonarchTokensProvider('flows-dsl', {
      tokenizer: {
        root: [
          [/Pantalla/, 'keyword'],
          [/Mostramos:/, 'keyword'],
          [/Opciones:/, 'keyword'],
          [/Si eliges/, 'keyword'],
          [/Ir a pantalla/, 'keyword'],
          [/•/, 'bullet'],
          [/[0-9]+\./, 'number'],
          [/"[^"]*"/, 'string'],
          [/[a-zA-Z][a-zA-Z0-9\s]*/, 'identifier'],
          [/\s+/, 'white'],
        ],
      },
    });

    // Definir tema
    monaco.editor.defineTheme('flows-dsl-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '60a5fa', fontStyle: 'bold' },
        { token: 'bullet', foreground: '9ca3af', fontStyle: 'bold' },
        { token: 'number', foreground: 'fbbf24', fontStyle: 'bold' },
        { token: 'string', foreground: '34d399' },
        { token: 'identifier', foreground: 'e5e7eb' },
      ],
      colors: {
        'editor.background': '#0f172a',
        'editor.foreground': '#e2e8f0',
        'editorLineNumber.foreground': '#64748b',
        'editorLineNumber.activeForeground': '#94a3b8',
        'editorCursor.foreground': '#60a5fa',
        'editor.selectionBackground': '#1e293b',
        'editor.lineHighlightBackground': '#1e293b',
      },
    });

    monaco.editor.setTheme('flows-dsl-theme');

    // Autocompletado
    monaco.languages.registerCompletionItemProvider('flows-dsl', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        
        const suggestions = [
          {
            label: 'Pantalla',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'Pantalla ${1:nombre}:',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Crea una nueva pantalla',
            range,
            sortText: '1',
          },
          {
            label: 'Mostramos:',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'Mostramos: ',
            documentation: 'Muestra texto al usuario',
            range,
            sortText: '2',
          },
          {
            label: 'Opciones:',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'Opciones:\n1. ${1:opción 1}\n2. ${2:opción 2}\n3. Cancelar',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Inicia una lista de opciones numeradas con Cancelar incluido',
            range,
            sortText: '3',
          },
          {
            label: 'Opciones: (bullets)',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'Opciones:\n• ${1:opción 1}\n• ${2:opción 2}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Inicia una lista de opciones con bullets (•)',
            range,
            sortText: '3.1',
          },
          {
            label: 'Si eliges',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'Si eliges "${1:opción}":\n  Ir a pantalla ${2:destino}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Define un flujo condicional',
            range,
            sortText: '4',
          },
          {
            label: 'Ir a pantalla',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'Ir a pantalla ${1:destino}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Navega a otra pantalla',
            range,
            sortText: '5',
          },
          {
            label: 'Salir',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'Salir',
            documentation: 'Termina el flujo y sale del bot',
            range,
            sortText: '6',
          },
          {
            label: 'Cancelar',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'Cancelar',
            documentation: 'Cancela la operación actual',
            range,
            sortText: '7',
          },
          {
            label: 'Sí',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'Sí',
            documentation: 'Opción de confirmación positiva',
            range,
            sortText: '8',
          },
          {
            label: 'No',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'No',
            documentation: 'Opción de confirmación negativa',
            range,
            sortText: '9',
          },
          {
            label: 'Imagen',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: '[IMAGEN: "${1:archivo.png}"]',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Inserta una imagen',
            range,
            sortText: '10',
          },
          {
            label: 'Formulario',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: '[FORMULARIO] ${1:nombre}:\nTEXTO "${2:Etiqueta}": ${3:campo} requerido\nEMAIL "${4:Email}": ${5:email} requerido\n[/FORMULARIO]',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Crea un formulario con campos',
            range,
            sortText: '11',
          },
        ];
        
        // Filtrar sugerencias basado en lo que el usuario está escribiendo
        const filteredSuggestions = suggestions.filter(suggestion => 
          suggestion.label.toLowerCase().startsWith(word.word.toLowerCase())
        );
        
        return {
          suggestions: filteredSuggestions.length > 0 ? filteredSuggestions : suggestions,
        };
      },
    });
  }, []);

  const handleFormat = useCallback(() => {
    if (onFormat) {
      onFormat();
    }
  }, [onFormat]);

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
