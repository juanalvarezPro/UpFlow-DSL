export interface KeywordTooltip {
  contents: Array<{ value: string }>;
}

export const keywordTooltips: Record<string, KeywordTooltip> = {
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
  },
  'irAPantalla': {
    contents: [
      { 
        value: '**irAPantalla** - Comando de navegación a otra pantalla (recomendado)\n\n**Sintaxis:**\n```\nirAPantalla: Nombre de la Pantalla\n```\n\n**Propiedades:**\n- `nombre_pantalla` (string, requerido): Nombre de la pantalla destino\n\n**Ejemplo:**\n```\nirAPantalla: Confirmacion\n```\n\n**Nota:** Este comando es más claro y directo que "Ir a pantalla".' 
      }
    ]
  }
};
