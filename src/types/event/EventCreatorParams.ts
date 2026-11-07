import { AnalyticsEvent } from "./AnalyticsEvent";
import { DefaultEventAction } from "./EventAction";
import { DefaultEventElement } from "./EventElement";

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

export interface EventCreatorParams<
  Element extends string = DefaultEventElement,
  Action extends string = DefaultEventAction,
> {
  callback: (event: AnalyticsEvent) => unknown;
  // called when building the event or running the callback fails
  onError?: (error: unknown, event?: AnalyticsEvent) => void;
  options?: EventCreatorOptions<Element, Action>;
}
