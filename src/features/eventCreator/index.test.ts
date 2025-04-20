import { eventCreator } from "./index";
import { EventHandler } from "../../types/event/EventHandlers";
import { EventCreatorParams } from "../../types/event/EventCreatorParams";

describe("eventCreator", () => {
  const mockCallback = jest.fn();

  const defaultParams: EventCreatorParams = {
    callback: mockCallback,
    options: {
      page: {
        currentPage: "Home",
        showOnLabel: true,
        showOnMetadata: true,
      },
      action: {
        possibleActions: ["click", "scroll"],
        showOnMetadata: true,
      },
      element: {
        possibleElements: ["button", "link"],
        showOnMetadata: true,
        showElementIdOnLabel: true,
      },
      labelOptions: {
        stringCase: "capitalize",
        stringFormat: "snake_case",
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create handlers for all elements and actions", () => {
    const handlers: EventHandler = eventCreator(defaultParams);

    expect(handlers).toHaveProperty("button");
    expect(handlers).toHaveProperty("link");
    expect(handlers.button).toHaveProperty("click");
    expect(handlers.button).toHaveProperty("scroll");
    expect(handlers.link).toHaveProperty("click");
    expect(handlers.link).toHaveProperty("scroll");
  });

  it("should call the callback with the correct label and metadata", () => {
    const handlers: EventHandler = eventCreator(defaultParams);

    const eventMetadata = { elementId: "123", customData: "test" };
    handlers.button.click(eventMetadata);

    expect(mockCallback).toHaveBeenCalledWith({
      label: "Home_Button_Click_123",
      metadata: {
        ...eventMetadata,
        page: "Home",
        element: "button",
        action: "click",
      },
    });
  });

  it("should exclude page from metadata if showOnMetadata is false", () => {
    const params = {
      ...defaultParams,
      options: {
        ...defaultParams.options,
        page: {
          ...defaultParams.options?.page,
          showOnMetadata: false,
        },
      },
    };

    const handlers: EventHandler = eventCreator(params);

    const eventMetadata = { elementId: "789" };
    handlers.button.click(eventMetadata);

    expect(mockCallback).toHaveBeenCalledWith({
      label: "Home_Button_Click_789",
      metadata: {
        ...eventMetadata,
        element: "button",
        action: "click",
      },
    });
  });

  it("should handle default actions and elements if none are provided", () => {
    const params = {
      callback: mockCallback,
      options: {},
    };

    const handlers: EventHandler = eventCreator(params);

    expect(Object.keys(handlers).length).toBeGreaterThan(0);
    expect(
      Object.keys(handlers[Object.keys(handlers)[0]]).length
    ).toBeGreaterThan(0);
  });

  it("should format the label correctly with stringFormat set to 'noCase'", () => {
    const params: EventCreatorParams = {
      ...defaultParams,
      options: {
        ...defaultParams.options,
        labelOptions: {
          stringCase: "lowercase",
          stringFormat: "noCase",
        },
      },
    };

    const handlers: EventHandler = eventCreator(params);

    const eventMetadata = { elementId: "456" };
    handlers.link.click(eventMetadata);

    expect(mockCallback).toHaveBeenCalledWith({
      label: "home link click 456",
      metadata: {
        ...eventMetadata,
        page: "Home",
        element: "link",
        action: "click",
      },
    });
  });
});
