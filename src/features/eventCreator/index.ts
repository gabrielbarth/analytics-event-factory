import { EventAction } from "../../types/event/EventAction";
import { EventCreatorParams } from "../../types/event/EventCreatorParams";
import { EventElement } from "../../types/event/EventElement";
import { EventHandler } from "../../types/event/EventHandlers";
import { EventMetadata } from "../../types/event/EventMetadata";
import { eventActions as defaultEventActions } from "../../utils/constants/eventActions";
import { eventElements as defaultEventElements } from "../../utils/constants/eventElements";
import { formatLabel } from "../../utils/helpers/formatLabel";

// function to create an object structure [element][action] and returns callback
export function eventCreator({
  callback,
  options,
}: EventCreatorParams): EventHandler {
  const handlers: EventHandler = {} as EventHandler;

  const page = options?.page?.currentPage?.trim() || undefined;
  const showPageOnLabel = options?.page?.showOnLabel;
  const showPageOnMetadata = options?.page?.showOnMetadata;
  const showElementIdOnLabel = options?.element?.showElementIdOnLabel;
  const labelOptions = options?.labelOptions;

  const eventElements =
    options?.element?.possibleElements || defaultEventElements;
  const eventActions = options?.action?.possibleActions || defaultEventActions;

  // iterate over each element
  eventElements.forEach((element: EventElement) => {
    handlers[element] = {} as EventHandler[EventElement];

    // iterate over each action
    eventActions.forEach((action: EventAction) => {
      // define an action handler that receives event metadata
      handlers[element][action] = (eventMetadata: EventMetadata) => {
        const elementId = showElementIdOnLabel
          ? String(eventMetadata?.elementId ?? "")
          : undefined;

        callback({
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
        });
      };
    });
  });

  return handlers;
}
