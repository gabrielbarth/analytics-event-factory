import { EventCreatorParams } from "../../types/event/EventCreatorParams";
import { EventElement } from "../../types/event/EventElement";
import { EventHandler } from "../../types/event/EventHandlers";
import { EventMetadata } from "../../types/event/EventMetadata";
import { eventActions } from "../../utils/constants/eventActions";
import { eventElements } from "../../utils/constants/eventElements";

// function to create an object structure [element][action] and returns callback
export function eventCreator({
  callback,
  options,
}: EventCreatorParams): EventHandler {
  const handlers: EventHandler = {} as EventHandler;

  const page = options?.page?.showOnLabel
    ? `${options?.page?.currentPage?.trim()}.`
    : "";
  const showPageOnMetadata = options?.page?.showOnMetadata;
  const showElementIdOnLabel = options?.element?.showElementIdOnLabel;

  // iterate over each element
  eventElements.forEach((element) => {
    handlers[element] = {} as EventHandler[EventElement];

    // iterate over each action
    eventActions.forEach((action) => {
      // define an action handler that receives event metadata
      handlers[element][action] = (eventMetadata: EventMetadata) => {
        const isShowElementId =
          eventMetadata?.elementId && showElementIdOnLabel;
        const elementId = isShowElementId
          ? `.${eventMetadata?.elementId?.trim()}`
          : "";
        callback({
          label: `${page}${element}.${action}${elementId}`,
          metadata: {
            ...eventMetadata,
            ...(showPageOnMetadata ? { page: page.slice(0, -1) } : {}),
          },
        });
      };
    });
  });

  return handlers;
}
