import { formatString } from "./formatString";

describe("formatString", () => {
  it("should return the string in uppercase when stringCase is 'uppercase'", () => {
    const result = formatString({
      str: "hello world",
      stringCase: "uppercase",
    });
    expect(result).toBe("HELLO WORLD");
  });

  it("should return the string in lowercase when stringCase is 'lowercase'", () => {
    const result = formatString({
      str: "Hello World",
      stringCase: "lowercase",
    });
    expect(result).toBe("hello world");
  });

  it("should capitalize each word when stringCase is 'capitalize'", () => {
    const result = formatString({
      str: "hello world",
      stringCase: "capitalize",
    });
    expect(result).toBe("Hello World");
  });

  it("should format the string as snake_case when stringFormat is 'snake_case'", () => {
    const result = formatString({
      str: "hello world",
      stringFormat: "snake_case",
    });
    expect(result).toBe("hello_world");
  });

  it("should format the string as camelCase when stringFormat is 'camelCase'", () => {
    const result = formatString({
      str: "hello world",
      stringFormat: "camelCase",
    });
    expect(result).toBe("helloWorld");
  });

  it("should format the string as kebab-case when stringFormat is 'kebab-case'", () => {
    const result = formatString({
      str: "hello world",
      stringFormat: "kebab-case",
    });
    expect(result).toBe("hello-world");
  });

  it("should format the string as PascalCase when stringFormat is 'PascalCase'", () => {
    const result = formatString({
      str: "hello world",
      stringFormat: "PascalCase",
    });
    expect(result).toBe("HelloWorld");
  });

  it("should format the string as dot.case when stringFormat is 'dotCase'", () => {
    const result = formatString({
      str: "hello world",
      stringFormat: "dotCase",
    });
    expect(result).toBe("hello.world");
  });

  it("should keep the string as is when stringFormat is 'noCase'", () => {
    const result = formatString({
      str: "hello@world!",
      stringFormat: "noCase",
    });
    expect(result).toBe("hello@world!");
  });

  it("should trim the string before returning the result", () => {
    const result = formatString({
      str: "  hello world  ",
      stringCase: "lowercase",
    });
    expect(result).toBe("hello world");
  });

  it("should apply both stringCase and stringFormat when both are provided", () => {
    const result = formatString({
      str: "hello world",
      stringCase: "uppercase",
      stringFormat: "snake_case",
    });
    expect(result).toBe("HELLO_WORLD");
  });
});
