import { EventFields } from "../../types/event/EventSchema";
import { EventMetadata } from "../../types/event/EventMetadata";
import { InvalidEventIssue } from "../../types/event/InvalidEventIssue";

interface ValidatedMetadata {
  metadata: EventMetadata;
  issues: InvalidEventIssue[];
}

// own properties only: "constructor" or "toString" are not fields of {}
const hasOwn = (object: object, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(object, key);

// keeps only the fields of the schema with values they accept
export const validateMetadata = (
  fields: EventFields,
  eventMetadata: EventMetadata | undefined,
): ValidatedMetadata => {
  const metadata: EventMetadata = {};
  const issues: InvalidEventIssue[] = [];
  const reported = new Set<string>();

  Object.keys(eventMetadata ?? {}).forEach((name) => {
    const value = eventMetadata?.[name];
    const schemaField = hasOwn(fields, name) ? fields[name] : undefined;

    if (!schemaField) {
      issues.push({ type: "unknown-field", field: name });
      return;
    }
    if (value === undefined && schemaField.isOptional) return;
    if (!schemaField.accepts(value)) {
      issues.push({ type: "invalid-value", field: name });
      reported.add(name);
      return;
    }
    metadata[name] = value;
  });

  Object.keys(fields).forEach((name) => {
    if (fields[name].isOptional || hasOwn(metadata, name) || reported.has(name)) {
      return;
    }
    issues.push({ type: "missing-field", field: name });
  });

  return { metadata, issues };
};
