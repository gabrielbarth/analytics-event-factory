# Changelog

## 3.1.0

### Added

- `schema` option for `eventCreator`, built with `defineEvents` and `field`. Each event declares its own fields. Only the events in the schema get handlers, and other fields or values are type errors.
- The schema is also checked at runtime. Fields outside it and values it does not accept are removed before the callback, and `onInvalid` receives what was removed, without the values.
- `page.possiblePages`, with a schema: any other page is sent as `"other"`.
- Exported types: `EventSchema`, `EventFields`, `Field`, `FieldKind`, `SchemaMetadata`, `SchemaActionHandler`, `SchemaEventHandler`, `SchemaEventCreatorParams`, `SchemaEventCreatorOptions` and `InvalidEventIssue`.

Nothing changes for code that does not pass a schema.

## 3.0.0

### Breaking changes

Some labels change, so the event names in your analytics tool change too. Check your dashboards and funnels before upgrading.

| Case                                 | 2.x                   | 3.0.0                |
| ------------------------------------ | --------------------- | -------------------- |
| page not on the label, `snake_case`  | `_button_click`       | `button_click`       |
| page not on the label, `dotCase`     | `.button.click`       | `button.click`       |
| page not on the label, `camelCase`   | `ButtonClick`         | `buttonClick`        |
| hyphenated action, `camelCase`       | `ListPulltorefresh`   | `listPullToRefresh`  |
| element id `btn-1`, `snake_case`     | `_button_click_btn1`  | `button_click_btn_1` |
| accented page `Início`, `snake_case` | `Incio_page_view`     | `Inicio_page_view`   |
| `showOnLabel` without `currentPage`  | `undefined_page_view` | `page_view`          |

- `stringFormat: "dotCase"` is now `"dot.case"`, and `"noCase"` is now `"raw"`.
- `stringCase` can no longer be combined with `camelCase` or `PascalCase`, which already define the case of each word.
- `metadata.page` is set whenever `page.showOnMetadata` is on, also without `page.showOnLabel`. It used to be an empty string in that case. It is left out when there is no page.
- Errors thrown by the callback no longer reach the code that fired the event. They go to `onError`, or to `console.error` by default.
- The callback receives an `AnalyticsEvent` instead of `unknown`.
- The `EventElement` and `EventAction` enums were removed. Use the exported `defaultEventElements` and `defaultEventActions`.

### Added

- ESM and CommonJS builds with an `exports` map. Version 2.0.0 failed to load in Node, with both `import` and `require`.
- Handlers are typed from `possibleElements` and `possibleActions`.
- Exported types: `AnalyticsEvent`, `EventCreatorParams`, `EventCreatorOptions`, `EventHandler`, `ActionHandler`, `EventMetadata`, `LabelOptions`, `StringFormat`, `StringCase`, `DefaultEventElement` and `DefaultEventAction`.
- `page.currentPage` accepts a function, read on every event.
- `onError`, called when the callback throws or its promise rejects.
