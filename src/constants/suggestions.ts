import { Keywords } from "@/enums/keyWords";
import type * as monaco from 'monaco-editor';

export function suggestions({ range, monaco }: { range: monaco.Range; monaco: typeof import('monaco-editor') }) {
  return [
    {
      label: Keywords.Pantalla,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: Keywords.Pantalla + " ${1:nombre}:",
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "create a new screen",
      range,
      sortText: "1",
    },
    {
      label: Keywords.Lista,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: Keywords.Lista + " ${1:nombre} :\n1. Opcional: ${1:opción 1}\n2. ${2:opción 2}\n",
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "create a new lista field",
      range,
      sortText: "2",
    },
    {
      label: Keywords.Opcional,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: Keywords.Opcional + ": ",
      documentation: "create a new opcional field",
      range,
      sortText: "3",
    },
  
    {
      label: Keywords.IrAPantalla,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: Keywords.IrAPantalla + " ${1:destino}",
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "navigate to another screen",
      range,
      sortText: "4",
    },
    {
      label: Keywords.Imagen,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: Keywords.Imagen + ': "${1:base64}" ${2:150}',
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Insert an image with base64 data",
      range,
      sortText: "5",
    },
    {
      label: Keywords.Titulo,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: Keywords.Titulo + ": ${1:titulo}",
      documentation: "Create a title",
      range,
      sortText: "6",
    },
  ];
}
