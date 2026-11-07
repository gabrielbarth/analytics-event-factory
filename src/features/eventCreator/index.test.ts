import { eventCreator } from "./index";
import {
  EventCreatorOptions,
  EventCreatorParams,
} from "../../types/event/EventCreatorParams";
import { eventActions } from "../../utils/constants/eventActions";
import { eventElements } from "../../utils/constants/eventElements";

describe("eventCreator", () => {
  const mockCallback = jest.fn();

  const defaultParams: EventCreatorParams<
    "button" | "link",
    "click" | "scroll"
  > = {
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
    const handlers = eventCreator(defaultParams);

    expect(handlers).toHaveProperty("button");
    expect(handlers).toHaveProperty("link");
    expect(handlers.button).toHaveProperty("click");
    expect(handlers.button).toHaveProperty("scroll");
    expect(handlers.link).toHaveProperty("click");
    expect(handlers.link).toHaveProperty("scroll");
  });

  it("should call the callback with the correct label and metadata", () => {
    const handlers = eventCreator(defaultParams);

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

    const handlers = eventCreator(params);

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
    const handlers = eventCreator({ callback: mockCallback });

    expect(Object.keys(handlers)).toEqual([...eventElements]);
    expect(Object.keys(handlers.button)).toEqual([...eventActions]);
  });

  it("should type the handlers from custom elements and actions", () => {
    const handlers = eventCreator({
      callback: mockCallback,
      options: {
        element: { possibleElements: ["tab"] },
        action: { possibleActions: ["swipe"] },
      },
    });

    handlers.tab.swipe();

    // @ts-expect-error button is not one of the possible elements
    expect(handlers.button).toBeUndefined();
    expect(mockCallback).toHaveBeenCalledWith({
      label: "tab swipe",
      metadata: {},
    });
  });

  it("should pass a typed event to the callback", () => {
    const labels: string[] = [];
    const handlers = eventCreator({
      callback: (event) => labels.push(event.label),
    });

    handlers.button.click();

    expect(labels).toEqual(["button click"]);
  });

  it("should not accept stringCase with camelCase or PascalCase", () => {
    // checked by the type checker (npm run typecheck)
    const options: EventCreatorOptions = {
      // @ts-expect-error camelCase already defines the case of each word
      labelOptions: { stringFormat: "camelCase", stringCase: "uppercase" },
    };

    expect(options).toBeDefined();
  });

  it("should format the label correctly with stringFormat set to 'raw'", () => {
    const params: typeof defaultParams = {
      ...defaultParams,
      options: {
        ...defaultParams.options,
        labelOptions: {
          stringCase: "lowercase",
          stringFormat: "raw",
        },
      },
    };

    const handlers = eventCreator(params);

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
  it("should not start the label with a separator when the page is not on the label", () => {
    const handlers = eventCreator({
      callback: mockCallback,
      options: { labelOptions: { stringFormat: "snake_case" } },
    });

    handlers.button.click();

    expect(mockCallback).toHaveBeenCalledWith({
      label: "button_click",
      metadata: {},
    });
  });

  it("should keep hyphenated actions and element ids as separate words", () => {
    const handlers = eventCreator({
      callback: mockCallback,
      options: {
        element: { showElementIdOnLabel: true },
        labelOptions: { stringFormat: "camelCase" },
      },
    });

    handlers.list["pull-to-refresh"]({ elementId: "feed-1" });

    expect(mockCallback).toHaveBeenCalledWith({
      label: "listPullToRefreshFeed1",
      metadata: { elementId: "feed-1" },
    });
  });

  it("should leave the page out of the label when currentPage is missing", () => {
    const handlers = eventCreator({
      callback: mockCallback,
      options: {
        page: { showOnLabel: true, showOnMetadata: true },
        labelOptions: { stringFormat: "snake_case" },
      },
    });

    handlers.page.view();

    expect(mockCallback).toHaveBeenCalledWith({
      label: "page_view",
      metadata: {},
    });
  });

  it("should add the page to the metadata even when it is not on the label", () => {
    const handlers = eventCreator({
      callback: mockCallback,
      options: { page: { currentPage: "Início", showOnMetadata: true } },
    });

    handlers.page.view();

    expect(mockCallback).toHaveBeenCalledWith({
      label: "page view",
      metadata: { page: "Início" },
    });
  });

  it("should not add the element id to the label when the option is off", () => {
    const handlers = eventCreator({
      callback: mockCallback,
      options: { labelOptions: { stringFormat: "snake_case" } },
    });

    handlers.button.click({ elementId: "btn-1" });

    expect(mockCallback).toHaveBeenCalledWith({
      label: "button_click",
      metadata: { elementId: "btn-1" },
    });
  });
});
