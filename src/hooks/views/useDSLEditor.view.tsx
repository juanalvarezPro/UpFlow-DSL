'use client';
import { suggestions, themeEditor, tokensEditor } from '@/constants';
import { Keywords } from '@/enums/keywords';
import type * as monaco from 'monaco-editor';
import { useCallback, useRef } from 'react';
interface UseDSLEditorViewProps {
    onFormat: () => void;
    registerNameEditor: string;
}
export function useDSLEditorView({ onFormat, registerNameEditor }: UseDSLEditorViewProps) {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    const handleEditorDidMount = useCallback((editor: monaco.editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => {
        editorRef.current = editor;

        // Registrar lenguaje
        monaco.languages.register({ id: registerNameEditor });

        // Configurar comportamiento del teclado
        editor.addCommand(monaco.KeyCode.Enter, () => {
            const position = editor.getPosition();
            const model = editor.getModel();

            if (!position || !model) return;

            const lineContent = model.getLineContent(position.lineNumber);
            const beforeCursor = lineContent.substring(0, position.column - 1);


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
                    if (line === `${Keywords.Opciones}:`) {
                        foundOptions = true;
                        break;
                    }
                    // Si encontramos otra pantalla o sección, salir
                    if (line.startsWith(`${Keywords.Pantalla} `) || line.startsWith(`${Keywords.Mostramos}:`) || line.startsWith(`${Keywords.SiEliges}`)) {
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

            // Si estamos en una línea vacía, verificar si estamos en una sección de opciones
            if (lineContent.trim() === '') {
                // Buscar hacia arriba para ver si hay una línea "Opciones:" reciente
                let foundOptions = false;
                for (let i = position.lineNumber - 1; i >= 1; i--) {
                    const line = model.getLineContent(i).trim();
                    if (line === `${Keywords.Opciones}:`) {
                        foundOptions = true;
                        break;
                    }
                    // Si encontramos otra pantalla o sección, salir
                    if (line.startsWith(`${Keywords.Pantalla} `) || line.startsWith(`${Keywords.Mostramos}:`) || line.startsWith(`${Keywords.SiEliges}`)) {
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

        tokensEditor({ nameEditor: registerNameEditor });

        // Definir tema
        monaco.editor.defineTheme(registerNameEditor + '-theme', themeEditor as monaco.editor.IStandaloneThemeData);

        monaco.editor.setTheme(registerNameEditor + '-theme');

        // Autocompletado
        monaco.languages.registerCompletionItemProvider(registerNameEditor, {
            provideCompletionItems: (model, position) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                } as monaco.Range;

                const mySuggestions = suggestions({ range });


                // Filtrar sugerencias basado en lo que el usuario está escribiendo
                const filteredSuggestions = mySuggestions.filter(suggestion =>
                    suggestion.label.toLowerCase().startsWith(word.word.toLowerCase())
                );

                return {
                    suggestions: filteredSuggestions.length > 0 ? filteredSuggestions : mySuggestions,
                };
            },
        });
    }, [registerNameEditor]);

    const handleFormat = useCallback(() => {
        if (onFormat) {
            onFormat();
        }
    }, [onFormat]);

    return {
        handleEditorDidMount,
        handleFormat,
    }
}

