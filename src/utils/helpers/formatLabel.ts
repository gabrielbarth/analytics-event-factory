import { StringCase, StringFormat } from "../../types/event/EventCreatorParams";

interface FormatLabelParams {
  parts: Array<string | undefined>;
  stringCase?: StringCase;
  stringFormat?: StringFormat;
}

const separators: Partial<Record<StringFormat, string>> = {
  snake_case: "_",
  "kebab-case": "-",
  "dot.case": ".",
};

const capitalize = (word: string): string =>
  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

const applyCase = (word: string, stringCase?: StringCase): string => {
  switch (stringCase) {
    case "uppercase":
      return word.toUpperCase();
    case "lowercase":
      return word.toLowerCase();
    case "capitalize":
      return capitalize(word);
    default:
      return word;
  }
};

const removeAccents = (value: string): string =>
  // guard for JS engines without String.prototype.normalize
  typeof value.normalize === "function"
    ? value.normalize("NFD").replace(/[̀-ͯ]/g, "")
    : value;

// split on any non-alphanumeric character and on camelCase boundaries
const splitWords = (value: string): string[] =>
  removeAccents(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);

const formatLabel = ({
  parts,
  stringCase,
  stringFormat,
}: FormatLabelParams): string => {
  const values = parts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));

  // keep the original characters, only apply the case
  if (stringFormat === "raw") {
    return values
      .join(" ")
      .split(/\s+/)
      .map((word) => applyCase(word, stringCase))
      .join(" ");
  }

  const words = values.flatMap(splitWords);

  switch (stringFormat) {
    case "camelCase":
      return words
        .map((word, index) =>
          index === 0 ? word.toLowerCase() : capitalize(word)
        )
        .join("");

    case "PascalCase":
      return words.map(capitalize).join("");

    default:
      return words
        .map((word) => applyCase(word, stringCase))
        .join((stringFormat && separators[stringFormat]) ?? " ");
  }
};

export { formatLabel };
