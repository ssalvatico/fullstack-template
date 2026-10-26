export interface TemplateEntity {
  "@id"?: string;
  name?: string;
  active?: boolean;
  items?: string[];
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
