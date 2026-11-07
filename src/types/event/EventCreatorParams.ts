import { AnalyticsEvent } from "./AnalyticsEvent";
import { DefaultEventAction } from "./EventAction";
import { DefaultEventElement } from "./EventElement";
import { EventSchema } from "./EventSchema";
import { InvalidEventIssue } from "./InvalidEventIssue";

export type StringFormat =
  "camelCase" | "PascalCase" | "snake_case" | "kebab-case" | "dot.case" | "raw";

export type StringCase = "lowercase" | "uppercase" | "capitalize";

// camelCase and PascalCase already define the case of each word
export type LabelOptions =
  | {
      stringFormat: "camelCase" | "PascalCase";
      stringCase?: never;
    }
  | {
      stringFormat?: Exclude<StringFormat, "camelCase" | "PascalCase">;
      stringCase?: StringCase;
    };

export type EventCreatorOptions<
  Element extends string = DefaultEventElement,
  Action extends string = DefaultEventAction,
> = {
  labelOptions?: LabelOptions;
  page?: {
    currentPage?: string | (() => string | undefined);
    showOnLabel?: boolean;
    showOnMetadata?: boolean;
  };
  action?: {
    possibleActions?: readonly Action[];
    showOnMetadata?: boolean;
  };
  element?: {
    possibleElements?: readonly Element[];
    showOnMetadata?: boolean;
    showElementIdOnLabel?: boolean;
  };
};

// with a schema, the elements and actions come from it
export type SchemaEventCreatorOptions = Omit<
  EventCreatorOptions,
  "action" | "element" | "page"
> & {
  page?: EventCreatorOptions["page"] & {
    // a page outside this list is sent as "other" (a route may carry an id)
    possiblePages?: readonly string[];
  };
  action?: {
    possibleActions?: never;
    showOnMetadata?: boolean;
  };
  element?: {
    possibleElements?: never;
    showOnMetadata?: boolean;
    showElementIdOnLabel?: boolean;
  };
};

export interface EventCreatorParams<
  Element extends string = DefaultEventElement,
  Action extends string = DefaultEventAction,
> {
  // without a schema there is nothing to validate the metadata against
  schema?: never;
  onInvalid?: never;
  callback: (event: AnalyticsEvent) => unknown;
  // called when building the event or running the callback fails
  onError?: (error: unknown, event?: AnalyticsEvent) => void;
  options?: EventCreatorOptions<Element, Action>;
}

export interface SchemaEventCreatorParams<Schema extends EventSchema> {
  schema: Schema;
  callback: (event: AnalyticsEvent) => unknown;
  // called when building the event or running the callback fails
  onError?: (error: unknown, event?: AnalyticsEvent) => void;
  // called with what was dropped from an event, before it is sent
  onInvalid?: (issues: InvalidEventIssue[], event: AnalyticsEvent) => void;
  options?: SchemaEventCreatorOptions;
}
