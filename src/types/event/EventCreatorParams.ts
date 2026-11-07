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

type EventCreatorParamsOptions = {
  labelOptions?: LabelOptions;
  page?: {
    currentPage?: string;
    showOnLabel?: boolean;
    showOnMetadata?: boolean;
  };
  action?: {
    possibleActions?: string[];
    showOnMetadata?: boolean;
  };
  element?: {
    possibleElements?: string[];
    showOnMetadata?: boolean;
    showElementIdOnLabel?: boolean;
  };
};

export interface EventCreatorParams {
  callback: (cbEventMetadata: unknown) => unknown;
  options?: EventCreatorParamsOptions;
}
