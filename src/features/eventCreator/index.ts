import { AnalyticsEvent } from "../../types/event/AnalyticsEvent";
import { DefaultEventAction } from "../../types/event/EventAction";
import { EventCreatorParams } from "../../types/event/EventCreatorParams";
import { DefaultEventElement } from "../../types/event/EventElement";
import { EventHandler } from "../../types/event/EventHandlers";
import { EventMetadata } from "../../types/event/EventMetadata";
import { eventActions as defaultEventActions } from "../../utils/constants/eventActions";
import { eventElements as defaultEventElements } from "../../utils/constants/eventElements";
import { formatLabel } from "../../utils/helpers/formatLabel";

const reportError = (error: unknown): void => {
  console.error("[analytics-event-factory] failed to send event:", error);
};

const isPromiseLike = (value: unknown): value is PromiseLike<unknown> =>
  typeof (value as PromiseLike<unknown> | undefined)?.then === "function";

// function to create an object structure [element][action] and returns callback
export function eventCreator<
  Element extends string = DefaultEventElement,
  Action extends string = DefaultEventAction,
>({
  callback,
  onError = reportError,
  options,
}: EventCreatorParams<Element, Action>): EventHandler<Element, Action> {
  const handlers = {} as EventHandler<Element, Action>;

  // read the page on every event, so a function can follow navigation
  const getPage = (): string | undefined => {
    const currentPage = options?.page?.currentPage;
    const page =
      typeof currentPage === "function" ? currentPage() : currentPage;
    return page?.trim() || undefined;
  };
  const showPageOnLabel = options?.page?.showOnLabel;
  const showPageOnMetadata = options?.page?.showOnMetadata;
  const showElementIdOnLabel = options?.element?.showElementIdOnLabel;
  const labelOptions = options?.labelOptions;

  const eventElements = (options?.element?.possibleElements ||
    defaultEventElements) as readonly Element[];
  const eventActions = (options?.action?.possibleActions ||
    defaultEventActions) as readonly Action[];

  // iterate over each element
  eventElements.forEach((element) => {
    handlers[element] = {} as EventHandler<Element, Action>[Element];

    // iterate over each action
    eventActions.forEach((action) => {
      // define an action handler that receives event metadata
      handlers[element][action] = (eventMetadata?: EventMetadata) => {
        let event: AnalyticsEvent | undefined;

        // analytics must never break the screen that fired the event
        try {
          const page = getPage();
          const elementId = showElementIdOnLabel
            ? String(eventMetadata?.elementId ?? "")
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
              ...eventMetadata,
              ...(showPageOnMetadata && page ? { page: page } : {}),
              ...(options?.element?.showOnMetadata ? { element: element } : {}),
              ...(options?.action?.showOnMetadata ? { action: action } : {}),
            },
          };

          const result = callback(event);
          if (isPromiseLike(result)) {
            result.then(undefined, (error) => onError(error, event));
          }
        } catch (error) {
          onError(error, event);
        }
      };
    });
  });

  return handlers;
}
