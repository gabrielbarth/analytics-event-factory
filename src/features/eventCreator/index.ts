import { EventReturn } from "../../types/event/EventHandlerReturn";
import { EventHandler } from "../../types/event/EventHandlers";
import { EventMetadata } from "../../types/event/EventMetadata";
import { eventActions } from "../../utils/constants/eventActions";
import { eventElements } from "../../utils/constants/eventElements";

// function to create an object structure [element][action] and returns callback
function eventCreator(callback: (event: any) => EventReturn): EventHandler {
  const handlers: EventHandler = {} as EventHandler;

  // iterate over each element
  eventElements.forEach((element) => {
    handlers[element] = {};

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

function logEvent(data: any): any {
  console.log(
    "-------------EVENT LOG-------------\n",
    JSON.stringify(data, null, 2),
    "\n-------------END OF EVENT LOG-------------\n"
  );
}

// usage example
const eventHandlers = eventCreator(logEvent);

eventHandlers.button.click({
  id: "btn-1",
  timestamp: Date.now(),
  description: "Button clicked",
});

eventHandlers.page.view({
  id: "page-1",
  timestamp: Date.now(),
  description: "Page viewed",
});
