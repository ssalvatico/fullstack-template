export interface ApiRoot {
    "@context":      string;
    "@id":           string;
    "@type":         string;
    [key: string]:   unknown;
}

export interface ApiEntity<T = Record<string, unknown>> {
  "@context": string;
  "@id": string;
  "@type": string;
  totalItems: number;
  member: T[];
}