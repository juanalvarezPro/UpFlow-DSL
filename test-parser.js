import { parse } from './src/lib/parser.ts';

const dsl = `Pantalla CITA "Agendamiento de Cita":

Agenda una cita en nuestra clínica
Seleccione el tipo de cita y la fecha que se ajuste a tu disponibilidad.

Dropdown TipoCita "Tipo de Cita" required:
1. Consulta General
2. Consulta Especializada
3. Examen de Laboratorio
4. Control de Salud Preventivo

Dropdown Sede "Sede" required:
1. El Poblado, Medellín
2. Las Palmas, Envigado
3. Laureles, Medellín

Dropdown Fecha "Fecha" required:
1. Lunes, Ene 01 2027
2. Martes, Ene 02 2027
3. Miércoles, Ene 03 2027
4. Viernes, Ene 05 2027

Dropdown Hora "Hora" required:
1. 10:30
2. 11:00
3. 11:30
4. 12:00
5. 12:30
`;

try {
  console.log('Testing Flow rule...');
  const result = parse(dsl, {});
  console.log('SUCCESS:', JSON.stringify(result, null, 2));
} catch (error) {
  console.log('ERROR:', error.message);
  console.log('Location:', error.location);
  console.log('Expected:', error.expected);
  console.log('Found:', error.found);
}
