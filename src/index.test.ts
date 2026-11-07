import { defineEvents, eventCreator, field } from "./index";

describe("package entry", () => {
  it("should export the schema helpers", () => {
    const callback = jest.fn();
    const events = eventCreator({
      schema: defineEvents({ page: { viewed: { step: field.number() } } }),
      callback,
    });

    events.page.viewed({ step: 1 });

    expect(callback).toHaveBeenCalledWith({
      label: "page viewed",
      metadata: { step: 1 },
    });
  });
});
