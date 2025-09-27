'use client';
import { suggestions } from '@/constants/suggestions';
import { themeEditor } from '@/constants/themeEditor';
import { tokensEditor } from '@/constants/tokensEditor';
import { Keywords } from '@/enums/keyWords';
import type * as monaco from 'monaco-editor';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { R2_CONFIG } from '@/lib/r2-config';

interface UseDSLEditorViewProps {
  onFormat: () => void;
  onChange: (newValue: string) => void;
}

export function useDSLEditorView({ onFormat, onChange }: UseDSLEditorViewProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const registerNameEditor = 'flows-dsl';
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleImageUpload = (r2Url: string) => {
    const editor = editorRef.current;
    if (editor) {
      const position = editor.getPosition();
      if (position) {
        try {
          // Convertir URL de R2 endpoint a dominio público si está configurado
          let finalUrl = r2Url;
          if (R2_CONFIG.publicDomain && r2Url.includes(R2_CONFIG.endpoint) && r2Url.includes(R2_CONFIG.bucketName)) {
            // Extraer la key (temp/image_id)
            const urlParts = r2Url.split('/');
            const key = urlParts.slice(-2).join('/'); // temp/image_id
            finalUrl = `${R2_CONFIG.publicDomain}/${key}`;
          }

          // Insertar la línea de imagen con la URL convertida
          const imageLine = `Imagen: "${finalUrl}" 150\n`;

          // Obtener el contenido actual del editor
          const currentValue = editor.getValue();
          const lines = currentValue.split('\n');

          // Insertar la nueva línea en la posición correcta
          lines.splice(position.lineNumber - 1, 0, imageLine);
          const newValue = lines.join('\n');

          // Actualizar el contenido del editor
            onChange(newValue);

          // Mover el cursor a la siguiente línea
          editor.setPosition({
            lineNumber: position.lineNumber + 1,
            column: 1,
          });
        } catch (error) {
          console.error('Error inserting image:', error);
          toast.error('Error al insertar la imagen en el editor.');
          return;
        }
      }
    }
    setShowImageUpload(false);
  };

  const handleImageCancel = () => {
    setShowImageUpload(false);
  };

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
        for (let i = position.lineNumber - 1; i >= 1; i--) {
          const line = model.getLineContent(i).trim();
          // Si encontramos otra pantalla o sección, salir
          if (line.startsWith(`${Keywords.Pantalla} `) || line.startsWith(`${Keywords.Mostramos}:`) || line.startsWith(`${Keywords.SiEliges}`)) {
            break;
          }
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

    monaco.languages.setMonarchTokensProvider(registerNameEditor, tokensEditor as monaco.languages.IMonarchLanguage);
    
    // Registrar hover provider para tooltips de keywords
    monaco.languages.registerHoverProvider(registerNameEditor, {
      provideHover: (model, position) => {
        const word = model.getWordAtPosition(position);
        if (!word) return null;

        const keyword = word.word;

        // Obtener el contexto de la línea para detectar keywords compuestos
        const lineContent = model.getLineContent(position.lineNumber);
        const beforeCursor = lineContent.substring(0, position.column - 1);
        const afterCursor = lineContent.substring(position.column - 1);

        // Tooltips para keywords
        const keywordTooltips = {
          'Pantalla': {
            contents: [
              { 
                value: '**Pantalla** - Define una nueva pantalla en el flujo\n\n**Sintaxis:**\n```\nPantalla "Nombre de la Pantalla":\n```\n\n**Propiedades:**\n- `nombre` (string, requerido): Nombre único de la pantalla entre comillas\n\n**Ejemplo:**\n```\nPantalla "Bienvenida":\n  Titulo: ¡Hola!\n  Mostramos: Bienvenido a nuestra app\n```' 
              }
            ]
          },
          'Titulo': {
            contents: [
              { 
                value: '**Titulo** - Agrega un título principal a la pantalla\n\n**Sintaxis:**\n```\nTitulo: Tu título aquí\n```\n\n**Propiedades:**\n- `texto` (string, requerido): Texto del título\n\n**Ejemplo:**\n```\nTitulo: Agendamiento de Cita\n```' 
              }
            ]
          },
          'Imagen': {
            contents: [
              { 
                value: '**Imagen** - Inserta una imagen en la pantalla\n\n**Sintaxis:**\n```\nImagen: "url_de_la_imagen" [altura]\n```\n\n**Propiedades:**\n- `src` (string, requerido): URL de la imagen entre comillas\n- `altura` (number, opcional): Altura en píxeles\n\n**Ejemplo:**\n```\nImagen: "https://ejemplo.com/imagen.jpg" 200\n```' 
              }
            ]
          },
          'Lista': {
            contents: [
              { 
                value: '**Lista** - Crea una lista desplegable con opciones\n\n**Sintaxis:**\n```\nLista "Nombre de la Lista":\n1. valor1 - Texto visible 1\n2. valor2 - Texto visible 2\n```\n\n**Propiedades:**\n- `nombre` (string, requerido): Nombre de la lista entre comillas\n- `opciones` (lista, requerido): Lista numerada de opciones\n\n**Ejemplo:**\n```\nLista "Tipo de Cita":\n1. general - Consulta General\n2. especializada - Consulta Especializada\n```' 
              }
            ]
          },
          'Mostramos': {
            contents: [
              { 
                value: '**Mostramos** - Define el contenido principal de la pantalla\n\n**Sintaxis:**\n```\nMostramos: Tu contenido aquí\n```\n\n**Propiedades:**\n- `contenido` (string, requerido): Texto o contenido a mostrar\n\n**Ejemplo:**\n```\nMostramos: Selecciona el tipo de cita que necesitas\n```' 
              }
            ]
          },
          'Opcional': {
            contents: [
              { 
                value: '**Opcional** - Marca una opción como no requerida\n\n**Sintaxis:**\n```\nOpcional: Texto de la opción opcional\n```\n\n**Propiedades:**\n- `texto` (string, requerido): Texto de la opción opcional\n\n**Ejemplo:**\n```\nOpcional: Agregar comentarios adicionales\n```' 
              }
            ]
          },
          'Ir': {
            contents: [
              { 
                value: '**Ir a pantalla** - Navega a otra pantalla del flujo\n\n**Sintaxis:**\n```\nIr a pantalla "Nombre de la Pantalla"\n```\n\n**Propiedades:**\n- `nombre_pantalla` (string, requerido): Nombre de la pantalla destino entre comillas\n\n**Ejemplo:**\n```\nIr a pantalla "Confirmacion"\n```' 
              }
            ]
          }
        };

        // Verificar si estamos en "Ir a pantalla"
        if (keyword === 'Ir' && afterCursor.trim().startsWith('a pantalla')) {
          return keywordTooltips['Ir'];
        }

        const tooltip = keywordTooltips[keyword as keyof typeof keywordTooltips];
        if (tooltip) {
          return tooltip;
        }

        return null;
      }
    });

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
        };

        const mysuggestions = suggestions({ range: range as monaco.Range, monaco });

        // Mejorar el filtrado de sugerencias
        let filteredSuggestions = mysuggestions;

        if (word.word && word.word.length > 0) {
          // Filtrar por coincidencia parcial (no solo al inicio)
          filteredSuggestions = mysuggestions.filter(suggestion =>
            suggestion.label.toLowerCase().includes(word.word.toLowerCase()) ||
            suggestion.label.toLowerCase().startsWith(word.word.toLowerCase())
          );
        }

        // Si no hay coincidencias, mostrar todas las sugerencias
        if (filteredSuggestions.length === 0) {
          filteredSuggestions = mysuggestions;
        }

        return {
          suggestions: filteredSuggestions,
        };
      },
      triggerCharacters: [' ', ':', '\n'],
    });
  }, []);

  const handleFormat = useCallback(() => {
    if (onFormat) {
      onFormat();
    }
  }, [onFormat]);

  return {
    handleEditorDidMount,
    handleFormat,
    editorRef,
    handleImageUpload,
    handleImageCancel,
    showImageUpload,
    setShowImageUpload,
  };
}


