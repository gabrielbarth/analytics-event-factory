import { eventCreator } from "./index";
import { defineEvents, field } from "../eventSchema";
import { SchemaEventCreatorParams } from "../../types/event/EventCreatorParams";

describe("eventCreator with a schema", () => {
  const mockCallback = jest.fn();

  const schema = defineEvents({
    category: { corrected: { scope: field.oneOf("only_this", "always") } },
    first_import: { seen: {} },
    pluggy: {
      step: {
        step: field.oneOf("opened", "institution_selected"),
        connector: field.number().optional(),
      },
    },
    button: { clicked: { elementId: field.oneOf("hide_values") } },
  });

  type OnInvalid = SchemaEventCreatorParams<typeof schema>["onInvalid"];

  const createEvents = (onInvalid: OnInvalid = jest.fn(), onError = jest.fn()) =>
    eventCreator({
      schema,
      callback: mockCallback,
      onInvalid,
      onError,
      options: { labelOptions: { stringFormat: "snake_case" } },
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create handlers only for the events in the schema", () => {
    const events = createEvents();

    expect(Object.keys(events)).toEqual([
      "category",
      "first_import",
      "pluggy",
      "button",
    ]);
    expect(Object.keys(events.category)).toEqual(["corrected"]);
    // @ts-expect-error "created" is not an action of category
    expect(events.category.created).toBeUndefined();
  });

  it("should send the event with the label from the element and the action", () => {
    const events = createEvents();

    events.category.corrected({ scope: "always" });

    expect(mockCallback).toHaveBeenCalledWith({
      label: "category_corrected",
      metadata: { scope: "always" },
    });
  });

  it("should send an event without fields", () => {
    const events = createEvents();

    events.first_import.seen();

    expect(mockCallback).toHaveBeenCalledWith({
      label: "first_import_seen",
      metadata: {},
    });
  });

  it("should accept an event without its optional fields", () => {
    const events = createEvents();

    events.pluggy.step({ step: "opened" });
    events.pluggy.step({ step: "institution_selected", connector: 612 });

    expect(mockCallback).toHaveBeenNthCalledWith(1, {
      label: "pluggy_step",
      metadata: { step: "opened" },
    });
    expect(mockCallback).toHaveBeenNthCalledWith(2, {
      label: "pluggy_step",
      metadata: { step: "institution_selected", connector: 612 },
    });
  });

  it("should reject fields and values outside the schema at compile time", () => {
    // checked by the type checker (npm run typecheck)
    const events = createEvents();

    // @ts-expect-error "everything" is not one of the scopes
    events.category.corrected({ scope: "everything" });
    // @ts-expect-error total is not a field of category_corrected
    events.category.corrected({ scope: "always", total: 1234.56 });
    // @ts-expect-error scope is required
    events.category.corrected();
    // @ts-expect-error first_import_seen has no fields
    events.first_import.seen({ total: 1234.56 });

    expect(mockCallback).toHaveBeenCalledTimes(4);
  });

  it("should drop what the schema does not allow before the callback", () => {
    const onInvalid = jest.fn();
    const events = createEvents(onInvalid);
    // a variable skips the compile-time check, as data from outside would
    const metadata = { scope: "always", total: 1234.56 } as never;

    events.category.corrected(metadata);

    const sent = { label: "category_corrected", metadata: { scope: "always" } };
    expect(mockCallback).toHaveBeenCalledWith(sent);
    expect(onInvalid).toHaveBeenCalledWith(
      [{ type: "unknown-field", field: "total" }],
      sent,
    );
  });

  it("should not call onInvalid for a valid event", () => {
    const onInvalid = jest.fn();
    const events = createEvents(onInvalid);

    events.category.corrected({ scope: "only_this" });

    expect(onInvalid).not.toHaveBeenCalled();
  });

  it("should warn about invalid events when onInvalid is not given", () => {
    const consoleWarn = jest
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);
    const events = eventCreator({ schema, callback: mockCallback });

    events.category.corrected({ scope: "nope" } as never);

    expect(consoleWarn).toHaveBeenCalledWith(
      "[analytics-event-factory] invalid event:",
      "category corrected",
      [{ type: "invalid-value", field: "scope" }],
    );
    consoleWarn.mockRestore();
  });

  it("should still send the event when onInvalid throws", () => {
    const error = new Error("reporter offline");
    const onError = jest.fn();
    const events = createEvents(() => {
      throw error;
    }, onError);

    events.category.corrected({ scope: "always", total: 1 } as never);

    const sent = { label: "category_corrected", metadata: { scope: "always" } };
    expect(onError).toHaveBeenCalledWith(error, sent);
    expect(mockCallback).toHaveBeenCalledWith(sent);
  });

  it("should send callback errors to onError", () => {
    const error = new Error("SDK offline");
    const onError = jest.fn();
    const events = eventCreator({
      schema,
      callback: () => {
        throw error;
      },
      onError,
    });

    expect(() => events.first_import.seen()).not.toThrow();
    expect(onError).toHaveBeenCalledWith(error, {
      label: "first import seen",
      metadata: {},
    });
  });

  it("should apply the page, element and action options", () => {
    const events = eventCreator({
      schema,
      callback: mockCallback,
      options: {
        page: { currentPage: "statement", showOnLabel: true, showOnMetadata: true },
        element: { showOnMetadata: true, showElementIdOnLabel: true },
        action: { showOnMetadata: true },
        labelOptions: { stringFormat: "snake_case" },
      },
    });

    events.button.clicked({ elementId: "hide_values" });

    expect(mockCallback).toHaveBeenCalledWith({
      label: "statement_button_clicked_hide_values",
      metadata: {
        elementId: "hide_values",
        page: "statement",
        element: "button",
        action: "clicked",
      },
    });
  });

  describe("possiblePages", () => {
    const createPageEvents = (currentPage: string | undefined, onInvalid: OnInvalid) =>
      eventCreator({
        schema,
        callback: mockCallback,
        onInvalid,
        options: {
          page: {
            currentPage: () => currentPage,
            possiblePages: ["statement", "transaction"],
            showOnLabel: true,
            showOnMetadata: true,
          },
          labelOptions: { stringFormat: "snake_case" },
        },
      });

    it("should keep a page from the list", () => {
      const onInvalid = jest.fn();

      createPageEvents("statement", onInvalid).first_import.seen();

      expect(mockCallback).toHaveBeenCalledWith({
        label: "statement_first_import_seen",
        metadata: { page: "statement" },
      });
      expect(onInvalid).not.toHaveBeenCalled();
    });

    it("should send a page outside the list as other", () => {
      const onInvalid = jest.fn();

      createPageEvents("transaction/abc123", onInvalid).first_import.seen();

      const sent = { label: "other_first_import_seen", metadata: { page: "other" } };
      expect(mockCallback).toHaveBeenCalledWith(sent);
      expect(onInvalid).toHaveBeenCalledWith([{ type: "unknown-page" }], sent);
    });

    it("should not report a missing page", () => {
      const onInvalid = jest.fn();

      createPageEvents(undefined, onInvalid).first_import.seen();

      expect(mockCallback).toHaveBeenCalledWith({
        label: "first_import_seen",
        metadata: {},
      });
      expect(onInvalid).not.toHaveBeenCalled();
    });
  });

  it("should not put a rejected element id on the label", () => {
    const events = eventCreator({
      schema,
      callback: mockCallback,
      onInvalid: jest.fn(),
      options: {
        element: { showElementIdOnLabel: true },
        labelOptions: { stringFormat: "snake_case" },
      },
    });

    events.button.clicked({ elementId: "hide_from_ana" } as never);

    expect(mockCallback).toHaveBeenCalledWith({
      label: "button_clicked",
      metadata: {},
    });
  });
});
