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
      label: Keywords.Mostramos,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: Keywords.Mostramos + ": ",
      documentation: "show text to the user",
      range,
      sortText: "4",
    },
    {
      label: Keywords.SiEliges,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText:
        Keywords.SiEliges +
        ' "${1:opción}":\n  ' +
        Keywords.IrAPantalla +
        " ${2:destino}",
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "define a conditional flow",
      range,
      sortText: "5",
    },
    {
      label: Keywords.IrAPantalla,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: Keywords.IrAPantalla + " ${1:destino}",
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "navigate to another screen",
      range,
      sortText: "6",
    },
    {
      label: Keywords.Salir,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: Keywords.Salir,
      documentation: "Termina el flujo and exit the bot",
      range,
      sortText: "7",
    },
    {
      label: Keywords.Cancelar,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: Keywords.Cancelar,
      documentation: "Cancela la operación actual",
      range,
      sortText: "8",
    },
    {
      label: Keywords.Sí,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: Keywords.Sí,
      documentation: "positive confirmation option",
      range,
      sortText: "9",
    },
    {
      label: Keywords.No,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: Keywords.No,
      documentation: "option of negative confirmation",
      range,
      sortText: "10",
    },
    {
      label: Keywords.Imagen,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: Keywords.Imagen + ': "${1:base64}" ${2:150}',
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Insert an image with base64 data",
      range,
      sortText: "11",
    },
    {
      label: Keywords.Formulario,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText:
        Keywords.Formulario +
        ' ${1:nombre}:\nTEXTO "${2:Etiqueta}": ${3:campo} requerido\nEMAIL "${4:Email}": ${5:email} requerido\n[' +
        Keywords.Formulario +
        "]",
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Create a form with fields",
      range,
      sortText: "12",
    },
    {
      label: Keywords.Titulo,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: Keywords.Titulo + ": ${1:titulo}",
      documentation: "Create a title",
      range,
      sortText: "13",
    },
  ];
}
