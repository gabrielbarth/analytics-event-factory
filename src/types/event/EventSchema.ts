export type FieldKind = "string" | "number" | "boolean" | "oneOf";

export interface Field<Value = unknown, Optional extends boolean = boolean> {
  readonly kind: FieldKind;
  // the allowed values of a oneOf field
  readonly values?: readonly Value[];
  readonly isOptional: Optional;
  readonly accepts: (value: unknown) => value is Value;
  readonly optional: () => Field<Value, true>;
}

// fields of one event, by name
export type EventFields = Record<string, Field>;

// element -> action -> fields
export type EventSchema = Record<string, Record<string, EventFields>>;

type FieldValue<F> = F extends Field<infer Value> ? Value : never;

type RequiredKeys<F extends EventFields> = {
  [K in keyof F]: F[K]["isOptional"] extends true ? never : K;
}[keyof F];

type OptionalKeys<F extends EventFields> = {
  [K in keyof F]: F[K]["isOptional"] extends true ? K : never;
}[keyof F];

// flattens the intersection so unknown properties are reported on object literals
type Simplify<T> = { [K in keyof T]: T[K] } & unknown;

export type SchemaMetadata<F extends EventFields> = Simplify<
  { [K in RequiredKeys<F>]: FieldValue<F[K]> } & {
    [K in OptionalKeys<F>]?: FieldValue<F[K]>;
  }
>;

export type SchemaActionHandler<F extends EventFields> = [keyof F] extends [
  never,
]
  ? () => void
  : [RequiredKeys<F>] extends [never]
    ? (eventMetadata?: SchemaMetadata<F>) => void
    : (eventMetadata: SchemaMetadata<F>) => void;

export type SchemaEventHandler<Schema extends EventSchema> = {
  [element in keyof Schema]: {
    [action in keyof Schema[element]]: SchemaActionHandler<
      Schema[element][action]
    >;
  };
};
