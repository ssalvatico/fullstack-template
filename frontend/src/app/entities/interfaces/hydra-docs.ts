export interface HydraProperty {
  title?: string;
  required?: boolean;
  readable?: boolean;
  writable?: boolean;
  property?: { label?: string; range?: string };
}

export interface HydraClass {
  '@id': string;
  title: string;
  supportedProperty?: HydraProperty[];
}

export interface HydraDocs {
  supportedClass: HydraClass[];
}

export type FieldType = 'text' | 'number' | 'checkbox' | 'datetime-local' | 'relation';

export interface FormField {
  name: string;
  required: boolean;
  type: FieldType;
  target?: string;
  multiple?: boolean;
}

export interface RelationOption {
  iri: string;
  label: string;
}

export function toFieldType(range?: string): FieldType {
  if (!range) return 'text';

  // "xmls:boolean", "xsd:boolean" o "http://www.w3.org/2001/XMLSchema#boolean" -> "boolean"
  const base = range.split(/[:#/]/).pop()?.toLowerCase() ?? '';

  if (range.startsWith('#') || range === 'hydra:Link') return 'relation';
  if (base === 'boolean') return 'checkbox';
  if (base === 'datetime') return 'datetime-local';
  if (['integer', 'int', 'decimal', 'float', 'double'].includes(base)) return 'number';
  return 'text';
}