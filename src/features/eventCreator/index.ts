import { EventElement } from "../../types/event/EventElement";
import { EventHandler } from "../../types/event/EventHandlers";
import { EventMetadata } from "../../types/event/EventMetadata";
import { eventActions } from "../../utils/constants/eventActions";
import { eventElements } from "../../utils/constants/eventElements";

// function to create an object structure [element][action] and returns callback
export function eventCreator(
  callback: (cbEventMetadata: unknown) => unknown
): EventHandler {
  const handlers: EventHandler = {} as EventHandler;
  // iterate over each element
  eventElements.forEach((element) => {
    handlers[element] = {} as EventHandler[EventElement];

    // iterate over each action
    eventActions.forEach((action) => {
      // define an action handler that receives event metadata
      handlers[element][action] = (eventMetadata: EventMetadata) => {
        callback({ label: `${element}.${action}`, metadata: eventMetadata });
      };
    });
  });

  return handlers;
}
