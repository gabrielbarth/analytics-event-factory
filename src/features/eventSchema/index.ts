import { EventSchema, Field, FieldKind } from "../../types/event/EventSchema";

function createField<Value>(
  kind: FieldKind,
  accepts: (value: unknown) => value is Value,
  values?: readonly Value[],
): Field<Value, false> {
  const optional = (): Field<Value, true> => ({
    kind,
    values,
    isOptional: true,
    accepts,
    optional,
  });

  return { kind, values, isOptional: false, accepts, optional };
}

export const field = {
  string: () =>
    createField(
      "string",
      (value: unknown): value is string => typeof value === "string",
    ),
  number: () =>
    createField(
      "number",
      (value: unknown): value is number =>
        typeof value === "number" && Number.isFinite(value),
    ),
  boolean: () =>
    createField(
      "boolean",
      (value: unknown): value is boolean => typeof value === "boolean",
    ),
  oneOf: <Value extends string | number>(first: Value, ...rest: Value[]) => {
    const values = [first, ...rest];
    return createField(
      "oneOf",
      (value: unknown): value is Value => values.includes(value as Value),
      values,
    );
  },
};

// identity function that checks the schema and keeps its types
export function defineEvents<Schema extends EventSchema>(
  schema: Schema,
): Schema {
  return schema;
}
