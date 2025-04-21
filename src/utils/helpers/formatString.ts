import { StringCase, StringFormat } from "../../types/event/EventCreatorParams";

interface FormatStringParams {
  str: string;
  stringCase?: StringCase;
  stringFormat?: StringFormat;
}

const formatString = ({
  str,
  stringCase,
  stringFormat,
}: FormatStringParams): string => {
  // remove all non-alphanumeric characters
  str = stringFormat === "noCase" ? str : str.replace(/[^a-zA-Z0-9\s]/g, "");

  if (stringCase) {
    switch (stringCase) {
      case "uppercase":
        str = str.toUpperCase();
        break;

      case "lowercase":
        str = str.toLowerCase();
        break;

      case "capitalize":
        str = str
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        break;
    }
  }

  if (stringFormat) {
    switch (stringFormat) {
      case "snake_case":
        str = str.replace(/\s+/g, "_");
        break;

      case "camelCase":
        str = str
          .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
            index === 0 ? match.toLowerCase() : match.toUpperCase()
          )
          .replace(/\s+/g, "");
        break;

      case "kebab-case":
        str = str.replace(/\s+/g, "-");
        break;

      case "PascalCase":
        str = str
          .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match) => match.toUpperCase())
          .replace(/\s+/g, "");
        break;

      case "dotCase":
        str = str.replace(/\s+/g, ".");
        break;
    }
  }

  return str.trim();
};

export { formatString };
