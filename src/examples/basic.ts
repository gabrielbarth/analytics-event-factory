import { eventCreator } from "analytics-event-factory";

// callback function
function logEvent(eventMetadata: unknown): unknown {
  console.log(
    "\n---------------EVENT LOG-----------------\n",
    JSON.stringify(eventMetadata, null, 2),
    "\n-------------END OF EVENT LOG-------------\n"
  );
  return;
}

// usage example
const eventHandler = eventCreator(logEvent);

eventHandler.button.click({
  id: "btn-1",
  timestamp: Date.now(),
  description: "Button clicked",
  // others metadata here
});

eventHandler.page.view({
  id: "page-1",
  timestamp: Date.now(),
  description: "Page viewed",
  // others metadata here
});
