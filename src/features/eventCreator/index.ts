import { AnalyticsEvent } from "../../types/event/AnalyticsEvent";
import { DefaultEventAction } from "../../types/event/EventAction";
import {
  EventCreatorParams,
  SchemaEventCreatorParams,
} from "../../types/event/EventCreatorParams";
import { DefaultEventElement } from "../../types/event/EventElement";
import { ActionHandler, EventHandler } from "../../types/event/EventHandlers";
import { EventMetadata } from "../../types/event/EventMetadata";
import {
  EventFields,
  EventSchema,
  SchemaEventHandler,
} from "../../types/event/EventSchema";
import { InvalidEventIssue } from "../../types/event/InvalidEventIssue";
import { eventActions as defaultEventActions } from "../../utils/constants/eventActions";
import { eventElements as defaultEventElements } from "../../utils/constants/eventElements";
import { formatLabel } from "../../utils/helpers/formatLabel";
import { validateMetadata } from "../../utils/helpers/validateMetadata";

const reportError = (error: unknown): void => {
  console.error("[analytics-event-factory] failed to send event:", error);
};

const reportInvalid = (
  issues: InvalidEventIssue[],
  event: AnalyticsEvent,
): void => {
  console.warn("[analytics-event-factory] invalid event:", event.label, issues);
};

const isPromiseLike = (value: unknown): value is PromiseLike<unknown> =>
  typeof (value as PromiseLike<unknown> | undefined)?.then === "function";

type Handlers = Record<string, Record<string, ActionHandler>>;

// handlers for the events of a schema, with metadata checked against it
export function eventCreator<Schema extends EventSchema>(
  params: SchemaEventCreatorParams<Schema>,
): SchemaEventHandler<Schema>;
// function to create an object structure [element][action] and returns callback
export function eventCreator<
  Element extends string = DefaultEventElement,
  Action extends string = DefaultEventAction,
>(params: EventCreatorParams<Element, Action>): EventHandler<Element, Action>;
export function eventCreator({
  schema,
  callback,
  onError = reportError,
  onInvalid = reportInvalid,
  options,
}:
  | EventCreatorParams<string, string>
  | SchemaEventCreatorParams<EventSchema>): Handlers {
  const handlers: Handlers = {};

  // read the page on every event, so a function can follow navigation
  const getPage = (): string | undefined => {
    const currentPage = options?.page?.currentPage;
    const page =
      typeof currentPage === "function" ? currentPage() : currentPage;
    return page?.trim() || undefined;
  };
  const possiblePages =
    options?.page && "possiblePages" in options.page
      ? options.page.possiblePages
      : undefined;
  const showPageOnLabel = options?.page?.showOnLabel;
  const showPageOnMetadata = options?.page?.showOnMetadata;
  const showElementIdOnLabel = options?.element?.showElementIdOnLabel;
  const labelOptions = options?.labelOptions;

  // without fields (no schema), the metadata goes as given
  const addHandler = (
    element: string,
    action: string,
    fields?: EventFields,
  ): void => {
    if (!handlers[element]) handlers[element] = {};

    // define an action handler that receives event metadata
    handlers[element][action] = (eventMetadata?: EventMetadata) => {
      let event: AnalyticsEvent | undefined;

      // analytics must never break the screen that fired the event
      try {
        const { metadata, issues } = fields
          ? validateMetadata(fields, eventMetadata)
          : { metadata: { ...eventMetadata }, issues: [] };
        let page = getPage();
        if (page && possiblePages && !possiblePages.includes(page)) {
          issues.push({ type: "unknown-page" });
          page = "other";
        }
        const elementId = showElementIdOnLabel
          ? String(metadata.elementId ?? "")
          : undefined;

        event = {
          label: formatLabel({
            parts: [
              showPageOnLabel ? page : undefined,
              element,
              action,
              elementId,
            ],
            stringCase: labelOptions?.stringCase,
            stringFormat: labelOptions?.stringFormat,
          }),
          metadata: {
            ...metadata,
            ...(showPageOnMetadata && page ? { page: page } : {}),
            ...(options?.element?.showOnMetadata ? { element: element } : {}),
            ...(options?.action?.showOnMetadata ? { action: action } : {}),
          },
        };
        const sent = event;

        // a failing report must not stop the valid part of the event
        if (issues.length > 0) {
          try {
            onInvalid(issues, sent);
          } catch (error) {
            onError(error, sent);
          }
        }

        const result = callback(sent);
        if (isPromiseLike(result)) {
          result.then(undefined, (error) => onError(error, sent));
        }
      } catch (error) {
        onError(error, event);
      }
    };
  };

  if (schema) {
    Object.keys(schema).forEach((element) => {
      Object.keys(schema[element]).forEach((action) => {
        addHandler(element, action, schema[element][action]);
      });
    });
    return handlers;
  }

  const eventElements =
    options?.element?.possibleElements || defaultEventElements;
  const eventActions = options?.action?.possibleActions || defaultEventActions;

  // iterate over each element and each action
  eventElements.forEach((element) => {
    eventActions.forEach((action) => addHandler(element, action));
  });

  return handlers;
}
