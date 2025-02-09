type StringFormat =
  | "camelCase"
  | "pascalCase"
  | "snakeCase"
  | "dotCase"
  | "kebabCase"
  | "noCase";

type StringCase = "lowercase" | "uppercase";

type EventCreatorParamsOptions = {
  page?: {
    currentPage?: string;
    stringCase?: StringCase;
    stringFormat?: StringFormat;
    showOnLabel?: boolean;
    showOnMetadata?: boolean;
  };
  action?: {
    possibleActions?: string[];
    stringCase?: StringCase;
    stringFormat?: StringFormat;
    showOnMetadata?: boolean;
  };
  element?: {
    possibleElements?: string[];
    stringCase?: StringCase;
    stringFormat?: StringFormat;
    showOnMetadata?: boolean;
    showElementIdOnLabel?: boolean;
  };
};

export interface EventCreatorParams {
  callback: (cbEventMetadata: unknown) => unknown;
  options?: EventCreatorParamsOptions;
}
