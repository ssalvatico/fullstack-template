/**
 * Mapeo centralizado entre "cómo se llaman las cosas en el backend" y
 * "cómo las usa el front".
 *
 * El resto de la app es agnóstico a los nombres de campo: los descubre en
 * runtime a partir de /api/docs.jsonld (ver backend.service.ts /
 * getFormFields). Pero hay dos lugares donde el front SÍ necesita decidir
 * algo sobre un campo puntual sin que el backend se lo diga explícitamente:
 *
 *   1. Qué campo usar como "etiqueta legible" de un item cuando aparece
 *      como opción en un <select> de relación (ej: elegir una Entity al
 *      crear un Item). Antes esto se resolvía asumiendo que todas las
 *      entidades tienen un campo `name`, lo cual rompe apenas una entidad
 *      usa `nombre`, `titulo`, o no tiene nada por el estilo.
 *
 *   2. Qué campos técnicos/de auditoría ocultar siempre (createdAt, etc).
 *
 * Si el backend cambia el nombre de un campo, agrega una entidad con un
 * campo "nombre-like" distinto, o suma un nuevo campo de auditoría, el
 * único archivo que hay que tocar es este.
 */

// Candidatos genéricos para "campo que sirve de etiqueta", en orden de
// prioridad. Se usan para cualquier entidad que no tenga una regla
// específica en DISPLAY_FIELD_BY_CLASS.
export const DISPLAY_FIELD_CANDIDATES: string[] = [
  'name',
  'nombre',
  'title',
  'titulo',
  'label',
  'nombreCompleto',
  'descripcion',
  'description',
];

// Overrides puntuales por clase (el título tal cual lo expone Hydra docs,
// ej: "Product", "TemplateEntity"). Agregar una línea acá cuando una
// entidad use un campo que no está en la lista genérica, o cuando tenga
// varios campos "name-like" y haya que desambiguar.
//
// Ejemplo:
// export const DISPLAY_FIELD_BY_CLASS: Record<string, string> = {
//   Product: 'sku',
// };
export const DISPLAY_FIELD_BY_CLASS: Record<string, string> = {};

// Campos que nunca se muestran como columna de tabla ni como input de
// formulario (metadata técnica/de auditoría). Si el backend suma un campo
// nuevo de este tipo (ej: 'deletedAt'), alcanza con agregarlo acá.
export const HIDDEN_FIELDS: string[] = ['createdAt', 'updatedAt'];

/**
 * Devuelve el valor a mostrar como etiqueta para un item, probando primero
 * el override de su clase (si existe) y después los candidatos genéricos
 * en orden. undefined si ninguno matchea (el caller decide el fallback,
 * típicamente el último segmento del IRI).
 */
export function resolveDisplayValue(
  item: Record<string, unknown>,
  className?: string
): string | undefined {
  const preferred = className ? DISPLAY_FIELD_BY_CLASS[className] : undefined;
  const candidates = preferred
    ? [preferred, ...DISPLAY_FIELD_CANDIDATES]
    : DISPLAY_FIELD_CANDIDATES;

  for (const field of candidates) {
    const value = item[field];
    if (typeof value === 'string' && value) return value;
  }
  return undefined;
}
