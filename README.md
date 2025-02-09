# analytics-event-factory

`analytics-event-factory` is a lightweight and customizable library for standardizing analytics event creation and dispatch. It helps maintain a structured and consistent format for event metadata, making it easier to track user interactions and debug analytics pipelines.

## 🚀 Installation

```bash
npm install analytics-event-factory
```

## 💡 Features

- Flexible event creation system.
- Easily configurable event metadata and labels.
- Supports callback functions for custom event processing.
- Page and element-based event standardization.

## 📖 Usage Example

```javascript
import { eventCreator } from "analytics-event-factory";

// Callback function to handle the event
function logEvent(eventMetadata) {
  console.log(
    "\n---------------EVENT LOG-----------------\n",
    JSON.stringify(eventMetadata, null, 2),
    "\n-------------END OF EVENT LOG-------------\n"
  );
}

// Create an event handler
const eventHandler = eventCreator({
  callback: logEvent,
  options: {
    page: {
      showOnLabel: true, // optional, default is false if not provided
      currentPage: "home", // optional, but only required if showOnLabel is true
      showOnMetadata: true, // optional, default is false if not provided
    },
    element: {
      showElementIdOnLabel: true, // optional, default is false if not provided
    },
  },
});

// Dispatching an event
eventHandler.button.click({
  id: "btn-1",
  timestamp: Date.now(),
  description: "Button clicked",
});

// Dispatching another event (without metadata)
eventHandler.button.click();
```

### Expected Output

```json
// return of the first event fired
{
  "label": "home.button.click.btn-1", // pattern: [page].[element-type].[action].[element-id]
  "metadata": {
    "elementId": "btn-1",
    "timestamp": 1739059943235,
    "description": "Button clicked",
    "page": "home",
  }
}

// return of the second event fired
{
  "label": "home.button.click", // pattern: [page].[element-type].[action]
  "metadata": {}
}

```

## 🔧 Configuration Options

The `eventCreator` function accepts two primary configuration objects:

### `callback`

A function that will be executed whenever an event is dispatched.

### `options`

An object to customize event behavior.

| Option                         | Type       | Description                                  |
| ------------------------------ | ---------- | -------------------------------------------- |
| `page.showOnLabel`             | `boolean?` | Show the page name in the event label.       |
| `page.currentPage`             | `string?`  | The current page name.                       |
| `page.showOnMetadata`          | `boolean?` | Include the page name in the event metadata. |
| `element.showElementIdOnLabel` | `boolean?` | Show the element ID in the event label.      |

## 📚 API Reference

### `eventCreator({ callback, options })`

Creates an event handler with the given callback and configuration options.

#### Parameters

- `callback`: A function to handle dispatched events.
- `options`: An object for configuration, as described in the table above.

### Event Dispatch Methods

Each event handler provides functions to dispatch events by type (e.g., `button.click`). Event metadata can be passed as an argument.

### Metadata Structure

```json
{
  "label": "[page].[element-type].[action].[element-id]", // where page and element-id are optional
  "metadata": {
    "elementId": "[element-id]", // optional
    "page": "[page]" // optional
    // others metadata here
  }
}
```

## 🤝 Contributing

Feel free to open issues or submit pull requests if you find bugs or have suggestions for improvements.

## 📄 License

This project is licensed under the MIT License.
