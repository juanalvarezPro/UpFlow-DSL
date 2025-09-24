import dynamic from 'next/dynamic';
import type * as monaco from 'monaco-editor';
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface MonacoEditorViewProps {
    value: string;
    onChange: (value: string) => void;
    handleEditorDidMount: (editor: monaco.editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => void;
}

export function MonacoEditorView({ value, onChange, handleEditorDidMount }: MonacoEditorViewProps) {
    return (
        <div>
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
    )
}