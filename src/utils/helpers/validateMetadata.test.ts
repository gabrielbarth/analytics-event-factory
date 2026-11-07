import { field } from "../../features/eventSchema";
import { validateMetadata } from "./validateMetadata";

describe("validateMetadata", () => {
  const fields = {
    scope: field.oneOf("only_this", "always"),
    banks: field.number(),
    connector: field.number().optional(),
  };

  it("should keep the fields that match the schema", () => {
    const result = validateMetadata(fields, {
      scope: "always",
      banks: 2,
      connector: 612,
    });

    expect(result).toEqual({
      metadata: { scope: "always", banks: 2, connector: 612 },
      issues: [],
    });
  });

  it("should drop fields that are not in the schema", () => {
    const result = validateMetadata(fields, {
      scope: "always",
      banks: 2,
      total: 1234.56,
    });

    expect(result).toEqual({
      metadata: { scope: "always", banks: 2 },
      issues: [{ type: "unknown-field", field: "total" }],
    });
  });

  it("should drop values the field does not accept", () => {
    const result = validateMetadata(fields, { scope: "everything", banks: 2 });

    expect(result).toEqual({
      metadata: { banks: 2 },
      issues: [{ type: "invalid-value", field: "scope" }],
    });
  });

  it("should never put a rejected value in the issues", () => {
    const { issues } = validateMetadata(fields, {
      scope: "Ana Souza",
      banks: 2,
      email: "ana@example.com",
    });

    expect(JSON.stringify(issues)).not.toContain("Ana Souza");
    expect(JSON.stringify(issues)).not.toContain("ana@example.com");
  });

  it("should report required fields that are missing", () => {
    const result = validateMetadata(fields, { scope: "always" });

    expect(result).toEqual({
      metadata: { scope: "always" },
      issues: [{ type: "missing-field", field: "banks" }],
    });
  });

  it("should report a required field that was dropped only once", () => {
    const result = validateMetadata(fields, { scope: "always", banks: "2" });

    expect(result.issues).toEqual([{ type: "invalid-value", field: "banks" }]);
  });

  it("should accept a missing or undefined optional field", () => {
    expect(
      validateMetadata(fields, { scope: "always", banks: 2 }).issues,
    ).toEqual([]);
    expect(
      validateMetadata(fields, {
        scope: "always",
        banks: 2,
        connector: undefined,
      }),
    ).toEqual({ metadata: { scope: "always", banks: 2 }, issues: [] });
  });

  it("should not take inherited properties as fields", () => {
    const result = validateMetadata(
      { constructor: field.string() },
      { toString: "x" },
    );

    expect(result.issues).toEqual([
      { type: "unknown-field", field: "toString" },
      { type: "missing-field", field: "constructor" },
    ]);
  });

  it("should treat missing metadata as an empty object", () => {
    expect(validateMetadata({}, undefined)).toEqual({
      metadata: {},
      issues: [],
    });
    expect(validateMetadata(fields, undefined).issues).toEqual([
      { type: "missing-field", field: "scope" },
      { type: "missing-field", field: "banks" },
    ]);
  });
});
