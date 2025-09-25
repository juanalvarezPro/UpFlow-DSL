export interface ParseError {
  message: string;
  line: number;
  column: number;
  suggestion?: string;
}

export function createUserFriendlyError(error: any): ParseError {
  const message = error.message || 'Error de sintaxis desconocido';
  const location = error.location;
  
  if (!location) {
    return {
      message: 'Error de sintaxis en el código DSL',
      line: 1,
      column: 1,
      suggestion: 'Revisa la sintaxis del código y asegúrate de seguir el formato correcto.'
    };
  }

  const line = location.start?.line || 1;
  const column = location.start?.column || 1;
  
  // Analizar el tipo de error y proporcionar mensajes más amigables
  if (message.includes('Expected ":" but')) {
    return {
      message: `Falta el símbolo ":" en la línea ${line}`,
      line,
      column,
      suggestion: 'Después del nombre de la pantalla o lista, debes agregar ":" seguido del contenido.'
    };
  }
  
  if (message.includes('Expected "Pantalla" but')) {
    return {
      message: `Se esperaba la palabra "Pantalla" en la línea ${line}`,
      line,
      column,
      suggestion: 'Cada pantalla debe comenzar con la palabra "Pantalla" seguida del nombre.'
    };
  }
  
  if (message.includes('Expected "Lista" but')) {
    return {
      message: `Se esperaba la palabra "Lista" en la línea ${line}`,
      line,
      column,
      suggestion: 'Para crear una lista, usa la palabra "Lista" seguida del nombre y "required:".'
    };
  }
  
  if (message.includes('Expected "required:" but')) {
    return {
      message: `Falta "required:" en la línea ${line}`,
      line,
      column,
      suggestion: 'Después del nombre de la lista, debes agregar "required:" seguido de las opciones.'
    };
  }
  
  if (message.includes('Expected end of input but')) {
    return {
      message: `Hay contenido inesperado al final del código en la línea ${line}`,
      line,
      column,
      suggestion: 'Revisa que no haya caracteres extra o sintaxis incorrecta al final.'
    };
  }
  
  // Error genérico con información de ubicación
  return {
    message: `Error de sintaxis en la línea ${line}, columna ${column}`,
    line,
    column,
    suggestion: 'Revisa la sintaxis en esa ubicación. Asegúrate de usar las palabras clave correctas: "Pantalla", "Lista", "required:", etc.'
  };
}

export function formatErrorForDisplay(error: ParseError): string {
  let formatted = `❌ ${error.message}`;
  
  if (error.suggestion) {
    formatted += `\n\n💡 Sugerencia: ${error.suggestion}`;
  }
  
  formatted += `\n\n📍 Ubicación: Línea ${error.line}, Columna ${error.column}`;
  
  return formatted;
}
