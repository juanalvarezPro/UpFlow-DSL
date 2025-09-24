import { Keywords } from "@/enums/keywords";

export const DEFAULT_DSL = `${Keywords.Pantalla} CITA:
Agenda una cita en nuestra clínica
${Keywords.Opciones}:
1. Consulta General
2. Consulta Especializada
3. Examen de Laboratorio
4. Control de Salud Preventivo

${Keywords.Pantalla} DETALLES:
Completa tu información personal
${Keywords.Opciones}:
1. Continuar
2. Volver

${Keywords.Pantalla} CONFIRMACION:
¿Confirmas tu cita?
${Keywords.Opciones}:
1. Confirmar
2. Rechazar`;