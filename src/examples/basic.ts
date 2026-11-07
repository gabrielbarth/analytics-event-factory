import { AnalyticsEvent, eventCreator } from "analytics-event-factory";

// callback function
function logEvent(event: AnalyticsEvent): void {
  console.log(
    "\n---------------EVENT LOG-----------------\n",
    JSON.stringify(event, null, 2),
    "\n-------------END OF EVENT LOG-------------\n"
  );
}

// usage example
const eventHandler = eventCreator({
  callback: logEvent,
  options: {
    page: { currentPage: "home", showOnLabel: true, showOnMetadata: true },
    labelOptions: { stringFormat: "snake_case" },
  },
});

eventHandler.button.click({
  elementId: "btn-1",
  timestamp: Date.now(),
  description: "Button clicked",
  // others metadata here
});

eventHandler.page.view({
  timestamp: Date.now(),
  description: "Page viewed",
  // others metadata here
});
