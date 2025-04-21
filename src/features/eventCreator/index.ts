import { EventAction } from "../../types/event/EventAction";
import { EventCreatorParams } from "../../types/event/EventCreatorParams";
import { EventElement } from "../../types/event/EventElement";
import { EventHandler } from "../../types/event/EventHandlers";
import { EventMetadata } from "../../types/event/EventMetadata";
import { eventActions as defaultEventActions } from "../../utils/constants/eventActions";
import { eventElements as defaultEventElements } from "../../utils/constants/eventElements";
import { formatString } from "../../utils/helpers/formatString";

// function to create an object structure [element][action] and returns callback
export function eventCreator({
  callback,
  options,
}: EventCreatorParams): EventHandler {
  const handlers: EventHandler = {} as EventHandler;

  const page = options?.page?.showOnLabel
    ? `${options?.page?.currentPage?.trim()}`
    : "";
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
        const isShowElementId =
          eventMetadata?.elementId && showElementIdOnLabel;
        const elementId = isShowElementId
          ? ` ${eventMetadata?.elementId?.trim()}`
          : "";

        callback({
          label: formatString({
            str: `${page} ${element.trim()} ${action.trim()}${elementId}`,
            stringCase: labelOptions?.stringCase,
            stringFormat: labelOptions?.stringFormat,
          }),
          metadata: {
            ...eventMetadata,
            ...(showPageOnMetadata ? { page: page } : {}),
            ...(options?.element?.showOnMetadata ? { element: element } : {}),
            ...(options?.action?.showOnMetadata ? { action: action } : {}),
          },
        });
      };
    });
  });

  return handlers;
}
