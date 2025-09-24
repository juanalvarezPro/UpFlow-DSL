# UpFLows DSL

> **Un DSL natural para crear flujos conversacionales de Meta de forma intuitiva y eficiente**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## 🎯 El Problema

Crear flujos conversacionales para Meta puede ser una experiencia frustrante:

### ❌ **JSON Manual: Un Rollo Completo**
- **Sintaxis verbosa**: Requiere escribir cientos de líneas de JSON para flujos simples
- **Propenso a errores**: Un solo carácter mal colocado rompe todo el flujo
- **Difícil de mantener**: Modificar flujos existentes es un proceso tedioso y arriesgado
- **Poca legibilidad**: Los desarrolladores no pueden entender rápidamente la lógica del flujo
- **Tiempo de desarrollo**: Crear un flujo básico puede tomar horas en lugar de minutos

### ❌ **Versión Dinámica de Meta: Inestable**
- **Bugs frecuentes**: La interfaz gráfica tiene comportamientos impredecibles
- **Pérdida de trabajo**: Los cambios se pierden sin previo aviso
- **Limitaciones de diseño**: No permite personalizaciones avanzadas
- **Versionado problemático**: Difícil control de versiones y colaboración

## ✨ La Solución: UpFLows DSL

UpFLows DSL es un **Domain Specific Language** que permite crear flujos conversacionales usando sintaxis natural en español, generando automáticamente el JSON estructurado que Meta requiere.

### 🚀 **Ventajas Clave**

#### **1. Sintaxis Natural e Intuitiva**
```dsl
Pantalla CITA:
Agenda una cita en nuestra clínica
Opciones:
1. Consulta General
2. Consulta Especializada
3. Examen de Laboratorio
4. Control de Salud Preventivo
```

#### **2. Desarrollo 10x Más Rápido**
- ⚡ **Creación instantánea**: Flujos complejos en minutos, no horas
- 🔧 **Edición en tiempo real**: Ve los cambios inmediatamente
- 📝 **Sintaxis legible**: Cualquier desarrollador puede entender y modificar

#### **3. Menos Errores, Más Confiabilidad**
- ✅ **Validación automática**: El parser detecta errores de sintaxis
- 🔄 **Generación automática**: No más errores manuales en JSON
- 🧪 **Testing integrado**: Previsualización antes de implementar

#### **4. Mantenimiento Simplificado**
- 📚 **Código autodocumentado**: La sintaxis explica la lógica del flujo
- 🔄 **Refactoring fácil**: Cambios estructurales sin romper funcionalidad
- 👥 **Colaboración mejorada**: Equipos pueden trabajar en el mismo flujo

#### **5. Control Total**
- 💾 **Versionado Git**: Control completo de cambios y colaboración
- 🎨 **Personalización**: Modifica el DSL según tus necesidades
- 🔌 **Integración**: Se integra perfectamente en tu flujo de trabajo

## 🛠️ Características Técnicas

- **Parser PEG.js**: Análisis sintáctico robusto y extensible
- **Editor Monaco**: Experiencia de edición profesional con autocompletado
- **Generación JSON**: Compatible con la especificación de Meta Flows
- **TypeScript**: Tipado estático para mayor confiabilidad
- **Next.js 15**: Framework moderno con Turbopack para desarrollo rápido

## 🚀 Inicio Rápido

```bash
# Clonar el repositorio
git clone https://github.com/juanalvarez/upflows-dsl.git
cd upflows-dsl

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

Visita `http://localhost:3000` y comienza a crear flujos conversacionales de forma natural.

## 📖 Sintaxis del DSL

### Pantallas
```dsl
Pantalla NOMBRE_PANTALLA:
Descripción de lo que hace esta pantalla
```

### Opciones
```dsl
Opciones:
1. Primera opción
2. Segunda opción
3. Tercera opción
```

### Flujo Completo
```dsl
Pantalla BIENVENIDA:
¡Bienvenido a nuestro servicio!
Opciones:
1. Agendar cita
2. Consultar horarios
3. Contactar soporte

Pantalla AGENDAR:
Selecciona el tipo de consulta
Opciones:
1. Consulta General
2. Consulta Especializada
3. Examen de Laboratorio
```



## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Juan Alvarez**
- 🌐 Website: [juanalvarez.pro](https://juanalvarez.pro)
- 🐙 GitHub: [@juanalvarez](https://github.com/juanalvarezPro)


---

*Desarrollado con ❤️ para revolucionar la creación de flujos conversacionales*