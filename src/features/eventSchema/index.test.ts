import { defineEvents, field } from "./index";

describe("field", () => {
  it("should accept only strings in a string field", () => {
    const name = field.string();

    expect(name.accepts("Ana")).toBe(true);
    expect(name.accepts(1)).toBe(false);
    expect(name.accepts(undefined)).toBe(false);
  });

  it("should accept only finite numbers in a number field", () => {
    const amount = field.number();

    expect(amount.accepts(2)).toBe(true);
    expect(amount.accepts("2")).toBe(false);
    expect(amount.accepts(NaN)).toBe(false);
    expect(amount.accepts(Infinity)).toBe(false);
  });

  it("should accept only booleans in a boolean field", () => {
    const enabled = field.boolean();

    expect(enabled.accepts(false)).toBe(true);
    expect(enabled.accepts("false")).toBe(false);
  });

  it("should accept only the listed values in a oneOf field", () => {
    const scope = field.oneOf("only_this", "always");
    const step = field.oneOf(1, 2, 3);

    expect(scope.accepts("always")).toBe(true);
    expect(scope.accepts("never")).toBe(false);
    expect(step.accepts(2)).toBe(true);
    expect(step.accepts("2")).toBe(false);
  });

  it("should make a field optional without changing what it accepts", () => {
    const connector = field.number();
    const optionalConnector = connector.optional();

    expect(connector.isOptional).toBe(false);
    expect(optionalConnector.isOptional).toBe(true);
    expect(optionalConnector.accepts(612)).toBe(true);
    expect(optionalConnector.accepts("612")).toBe(false);
  });
});

describe("defineEvents", () => {
  it("should return the schema it receives", () => {
    const schema = {
      category: { corrected: { scope: field.oneOf("only_this", "always") } },
    };

    expect(defineEvents(schema)).toBe(schema);
  });

  it("should only accept fields created by field", () => {
    // checked by the type checker (npm run typecheck)
    // @ts-expect-error a plain string is not a field
    const schema = defineEvents({ category: { corrected: { scope: "always" } } });

    expect(schema).toBeDefined();
  });
});
