export type StringFormat =
  | "camelCase"
  | "PascalCase"
  | "snake_case"
  | "kebab-case"
  | "dotCase"
  | "noCase";

export type StringCase = "lowercase" | "uppercase" | "capitalize";

type EventCreatorParamsOptions = {
  labelOptions?: {
    stringCase?: StringCase;
    stringFormat?: StringFormat;
  };
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
