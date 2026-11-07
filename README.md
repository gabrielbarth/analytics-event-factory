# analytics-event-factory

`analytics-event-factory` is a lightweight, typed library for standardizing analytics events. You describe the elements and actions of your interface once and get handlers like `events.button.click()`. Each handler builds a consistent label and metadata and hands the event to your analytics tool (Firebase, Amplitude, Segment or anything else).

- No dependencies
- Ships ESM and CommonJS builds with TypeScript types
- Handlers are typed from your own elements and actions
- Analytics errors never break the screen that fired the event

## 🚀 Installation

```bash
npm install analytics-event-factory
```

## 📖 Usage

```ts
import { eventCreator } from "analytics-event-factory";

const events = eventCreator({
  callback: (event) => analytics.logEvent(event.label, event.metadata),
  options: {
    page: { currentPage: "home", showOnLabel: true, showOnMetadata: true },
    labelOptions: { stringFormat: "snake_case" },
  },
});

events.button.click({ elementId: "signup", plan: "pro" });
```

The callback receives:

```json
{
  "label": "home_button_click",
  "metadata": {
    "elementId": "signup",
    "plan": "pro",
    "page": "home"
  }
}
```

The label follows the pattern `[page] [element] [action] [element id]`. The page and the element id are optional.

## 🔧 Configuration

### `eventCreator({ callback, onError, options })`

| Parameter  | Type                                               | Description                                                                                                                            |
| ---------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `callback` | `(event: AnalyticsEvent) => unknown`               | Called for every event. It can be sync or async.                                                                                       |
| `onError`  | `(error: unknown, event?: AnalyticsEvent) => void` | Called when the callback throws or its promise rejects. Defaults to `console.error`. Errors never reach the code that fired the event. |
| `options`  | `EventCreatorOptions`                              | See the table below.                                                                                                                   |

### `options`

| Option                         | Type                                         | Default                   | Description                                                                  |
| ------------------------------ | -------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------- |
| `page.currentPage`             | `string \| () => string \| undefined`        | —                         | Current page or route. Pass a function to read it on every event.            |
| `page.showOnLabel`             | `boolean`                                    | `false`                   | Add the page to the label.                                                   |
| `page.showOnMetadata`          | `boolean`                                    | `false`                   | Add `page` to the metadata.                                                  |
| `element.possibleElements`     | `readonly string[]`                          | `defaultEventElements`    | Elements to create handlers for.                                             |
| `element.showOnMetadata`       | `boolean`                                    | `false`                   | Add `element` to the metadata.                                               |
| `element.showElementIdOnLabel` | `boolean`                                    | `false`                   | Add `metadata.elementId` to the label. See [naming limits](#-naming-limits). |
| `action.possibleActions`       | `readonly string[]`                          | `defaultEventActions`     | Actions to create for each element.                                          |
| `action.showOnMetadata`        | `boolean`                                    | `false`                   | Add `action` to the metadata.                                                |
| `labelOptions.stringFormat`    | `StringFormat`                               | words separated by spaces | See [label formats](#-label-formats).                                        |
| `labelOptions.stringCase`      | `"lowercase" \| "uppercase" \| "capitalize"` | keep as written           | Case of each word. Not available with `camelCase` and `PascalCase`.          |

Default elements: `page`, `button`, `image`, `list`, `item`, `card`, `link`, `text`, `modal`, `snackbar`, `toast`.

Default actions: `view`, `click`, `navigate`, `pull-to-refresh`.

## 🔤 Label formats

Each part of the label is split into words on spaces, symbols (`-`, `_`, `/`, `.`) and camelCase boundaries, and accents are removed. With the page `"Início"`, the element `list` and the action `pull-to-refresh`:

| `stringFormat` | Label                         |
| -------------- | ----------------------------- |
| not set        | `Inicio list pull to refresh` |
| `"snake_case"` | `Inicio_list_pull_to_refresh` |
| `"kebab-case"` | `Inicio-list-pull-to-refresh` |
| `"dot.case"`   | `Inicio.list.pull.to.refresh` |
| `"camelCase"`  | `inicioListPullToRefresh`     |
| `"PascalCase"` | `InicioListPullToRefresh`     |
| `"raw"`        | `Início list pull-to-refresh` |

Add `stringCase: "lowercase"` to get `inicio_list_pull_to_refresh`. Routes work too: the page `"/settings/profile"` becomes `settings_profile_button_click`.

## 🧩 Custom elements and actions

The handlers are typed from the lists you pass, so a missing element or action is a type error:

```ts
import { defaultEventElements, eventCreator } from "analytics-event-factory";

const events = eventCreator({
  callback: sendToAnalytics,
  options: {
    element: { possibleElements: [...defaultEventElements, "tab"] },
    action: { possibleActions: ["view", "click", "swipe"] },
  },
});

events.tab.swipe(); // ok
events.button.navigate(); // type error: "navigate" is not one of the actions
```

## 🧭 Following navigation

`currentPage` can be a function, which is read on every event. One event creator then covers the whole app:

```ts
// React Navigation
currentPage: () => navigationRef.getCurrentRoute()?.name,

// browser
currentPage: () => window.location.pathname,
```

## 🌐 Shared metadata and filtering

The callback runs for every event, so it is the place for metadata shared by all events and for dropping or cleaning events:

```ts
const events = eventCreator({
  callback: ({ label, metadata }) => {
    if (!analyticsEnabled) return;

    const { email, ...safeMetadata } = metadata; // keep personal data out
    analytics.logEvent(label, { ...safeMetadata, appVersion, platform });
  },
});
```

## 🚨 Errors

When the callback throws or returns a rejected promise, the error goes to `onError` and the code that fired the event keeps running:

```ts
const events = eventCreator({
  callback: (event) => analytics.logEvent(event.label, event.metadata),
  onError: (error, event) =>
    Sentry.captureException(error, { extra: { event } }),
});
```

## 📏 Naming limits

Firebase Analytics (GA4) accepts event names of up to 40 characters, with letters, numbers and underscores only, starting with a letter. It also caps an app at 500 distinct event names. For Firebase:

- use `stringFormat: "snake_case"`;
- keep `showElementIdOnLabel` off. An element id in the label creates a new event name for each element, while the id already goes in the metadata.

## ⬆️ Upgrading from 2.x

Version 3 changes some labels and option names. See the [changelog](CHANGELOG.md).

## 🤝 Contributing

Feel free to open issues or submit pull requests if you find bugs or have suggestions for improvements.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
