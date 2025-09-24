import type * as monaco from 'monaco-editor';

export const themeEditor: monaco.editor.IStandaloneThemeData = {
    base: 'vs-dark' as monaco.editor.IStandaloneThemeData['base'],
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
}