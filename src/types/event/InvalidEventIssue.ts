// what was wrong with an event, never the rejected value itself:
// the value may be the personal data the schema exists to keep out
export type InvalidEventIssue =
  | { type: "unknown-field"; field: string }
  | { type: "invalid-value"; field: string }
  | { type: "missing-field"; field: string }
  | { type: "unknown-page" };
