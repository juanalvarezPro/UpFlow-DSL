# Flows DSL

Un editor de DSL (Domain Specific Language) para crear flujos conversacionales con sintaxis natural, que genera JSON estructurado para aplicaciones de chat.

## 🚀 Características

- **Editor DSL en tiempo real** con Monaco Editor
- **Parsing automático** usando Peggy.js
- **JSON reactivo** que se actualiza automáticamente
- **Sintaxis natural** fácil de entender
- **Múltiples pantallas** soportadas automáticamente
- **UI simple y limpia** con overflow controlado

## 📝 Sintaxis del DSL

### Estructura Básica

```dsl
Pantalla NOMBRE_PANTALLA:
Texto descriptivo de la pantalla
Opciones:
1. Primera opción
2. Segunda opción
3. Tercera opción

Pantalla OTRA_PANTALLA:
Contenido de otra pantalla
Opciones:
1. Opción A
2. Opción B
```

### Elementos Soportados

#### Pantallas
- **Sintaxis**: `Pantalla NOMBRE:`
- **Descripción**: Define una nueva pantalla en el flujo
- **Ejemplo**: `Pantalla CITA:`

#### Texto
- **Sintaxis**: Cualquier línea que no sea "Pantalla" o "Opciones:"
- **Descripción**: Texto descriptivo de la pantalla
- **Ejemplo**: `Agenda una cita en nuestra clínica`

#### Opciones
- **Sintaxis**: 
  ```
  Opciones:
  1. Opción 1
  2. Opción 2
  ```
- **Descripción**: Lista numerada de opciones para el usuario
- **Ejemplo**: 
  ```
  Opciones:
  1. Consulta General
  2. Consulta Especializada
  ```

## 🏗️ Arquitectura del Proyecto

### Estructura de Archivos

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── DSLEditor.tsx     # Editor DSL con Monaco
│   ├── JSONPreview.tsx   # Vista previa del JSON
│   ├── MainLayout.tsx    # Layout principal
│   └── ui/               # Componentes UI básicos
│       ├── button.tsx    # Botón
│       └── card.tsx      # Tarjeta
├── hooks/                # Hooks personalizados
│   └── useDSLEditor.ts   # Hook principal del editor
└── lib/                  # Librerías y parsers
    ├── grammar.pegjs     # Gramática Peggy.js
    ├── parser.ts         # Parser generado
    └── utils.ts          # Utilidades
```

### Componentes Principales

#### `useDSLEditor` Hook
- **Propósito**: Maneja el estado del DSL y el parsing
- **Funcionalidades**:
  - Estado del DSL
  - Parsing en tiempo real
  - Formateo automático
  - Detección de múltiples pantallas

#### `DSLEditor` Component
- **Propósito**: Editor de texto con Monaco Editor
- **Características**:
  - Sintaxis highlighting
  - Autocompletado
  - Formateo automático
  - Overflow controlado

#### `JSONPreview` Component
- **Propósito**: Muestra el JSON generado
- **Características**:
  - Formateo JSON
  - Copia al portapapeles
  - Indicador de validez
  - Overflow controlado

## 🔧 Tecnologías Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Monaco Editor** - Editor de código
- **Peggy.js** - Generador de parsers
- **Lucide React** - Iconos

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd flowsDSL

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

### Uso
1. Abre la aplicación en tu navegador
2. Escribe tu DSL en el editor izquierdo
3. Ve el JSON generado en tiempo real en el panel derecho
4. Usa el botón "Formatear" para limpiar el código
5. Copia el JSON con el botón "Copiar"

## 📊 Formato de Salida JSON

El DSL se convierte a un JSON con la siguiente estructura:

```json
{
  "version": "6.0",
  "screens": [
    {
      "id": "CITA",
      "title": "CITA",
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "TextParagraph",
            "text": "Agenda una cita en nuestra clínica"
          },
          {
            "type": "Options",
            "items": [
              {
                "id": "consulta_general",
                "title": "Consulta General"
              },
              {
                "id": "consulta_especializada",
                "title": "Consulta Especializada"
              }
            ]
          }
        ]
      }
    }
  ]
}
```

## 🎯 Casos de Uso

- **Flujos de chat**: Crear conversaciones estructuradas
- **Formularios dinámicos**: Generar formularios basados en DSL
- **Bots conversacionales**: Definir flujos de conversación
- **Aplicaciones de citas**: Crear flujos de agendamiento
- **Sistemas de soporte**: Definir flujos de atención al cliente

## 🔄 Flujo de Trabajo

1. **Escritura**: El usuario escribe DSL en el editor
2. **Parsing**: Peggy.js parsea el DSL en tiempo real
3. **Validación**: Se valida la sintaxis y estructura
4. **Generación**: Se genera el JSON estructurado
5. **Visualización**: Se muestra el JSON en el panel derecho
6. **Exportación**: El usuario puede copiar el JSON generado

## 🛠️ Desarrollo

### Regenerar el Parser
```bash
npx peggy src/lib/grammar.pegjs -o src/lib/parser.ts --format es --allowed-start-rules Flow,SingleScreen
```

### Estructura de la Gramática
La gramática Peggy.js define:
- `Flow`: Múltiples pantallas
- `SingleScreen`: Una sola pantalla
- `Screen`: Estructura de pantalla individual
- `Options`: Lista de opciones
- `Text`: Texto descriptivo

## 📝 Ejemplos

### Ejemplo Básico
```dsl
Pantalla BIENVENIDA:
Bienvenido a nuestro servicio
Opciones:
1. Agendar cita
2. Consultar citas
3. Contactar soporte
```

### Ejemplo con Múltiples Pantallas
```dsl
Pantalla CITA:
Agenda una cita en nuestra clínica
Opciones:
1. Consulta General
2. Consulta Especializada

Pantalla DETALLES:
Completa tu información personal
Opciones:
1. Continuar
2. Volver

Pantalla CONFIRMACION:
¿Confirmas tu cita?
Opciones:
1. Confirmar
2. Rechazar
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Juan Alvarez**
- Website: [juanalvarez.pro](https://juanalvarez.pro)
- GitHub: [@juanalvarez](https://github.com/juanalvarez)

---

*Desarrollado con ❤️ para simplificar la creación de flujos conversacionales*