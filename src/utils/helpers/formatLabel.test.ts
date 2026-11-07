import { formatLabel } from "./formatLabel";

describe("formatLabel", () => {
  const parts = ["home", "button", "click"];

  it("should join words with spaces when no stringFormat is given", () => {
    expect(formatLabel({ parts })).toBe("home button click");
  });

  it("should return the string in uppercase when stringCase is 'uppercase'", () => {
    expect(formatLabel({ parts, stringCase: "uppercase" })).toBe(
      "HOME BUTTON CLICK"
    );
  });

  it("should return the string in lowercase when stringCase is 'lowercase'", () => {
    expect(
      formatLabel({ parts: ["Home", "Button"], stringCase: "lowercase" })
    ).toBe("home button");
  });

  it("should capitalize each word when stringCase is 'capitalize'", () => {
    expect(formatLabel({ parts, stringCase: "capitalize" })).toBe(
      "Home Button Click"
    );
  });

  it("should format the string as snake_case when stringFormat is 'snake_case'", () => {
    expect(formatLabel({ parts, stringFormat: "snake_case" })).toBe(
      "home_button_click"
    );
  });

  it("should format the string as kebab-case when stringFormat is 'kebab-case'", () => {
    expect(formatLabel({ parts, stringFormat: "kebab-case" })).toBe(
      "home-button-click"
    );
  });

  it("should format the string as dot.case when stringFormat is 'dot.case'", () => {
    expect(formatLabel({ parts, stringFormat: "dot.case" })).toBe(
      "home.button.click"
    );
  });

  it("should format the string as camelCase when stringFormat is 'camelCase'", () => {
    expect(formatLabel({ parts, stringFormat: "camelCase" })).toBe(
      "homeButtonClick"
    );
  });

  it("should format the string as PascalCase when stringFormat is 'PascalCase'", () => {
    expect(formatLabel({ parts, stringFormat: "PascalCase" })).toBe(
      "HomeButtonClick"
    );
  });

  it("should apply both stringCase and stringFormat when both are provided", () => {
    expect(
      formatLabel({
        parts,
        stringCase: "uppercase",
        stringFormat: "snake_case",
      })
    ).toBe("HOME_BUTTON_CLICK");
  });

  it("should skip empty parts without leaving a leading separator", () => {
    const emptyParts = [undefined, "", " ", "button", "click"];

    expect(formatLabel({ parts: emptyParts, stringFormat: "snake_case" })).toBe(
      "button_click"
    );
    expect(formatLabel({ parts: emptyParts, stringFormat: "dot.case" })).toBe(
      "button.click"
    );
    expect(formatLabel({ parts: emptyParts, stringFormat: "camelCase" })).toBe(
      "buttonClick"
    );
  });

  it("should treat hyphens and other symbols as word separators", () => {
    const symbolParts = ["list", "pull-to-refresh", "btn-1"];

    expect(
      formatLabel({ parts: symbolParts, stringFormat: "snake_case" })
    ).toBe("list_pull_to_refresh_btn_1");
    expect(formatLabel({ parts: symbolParts, stringFormat: "camelCase" })).toBe(
      "listPullToRefreshBtn1"
    );
    expect(
      formatLabel({
        parts: ["/home/details", "page", "view"],
        stringFormat: "snake_case",
      })
    ).toBe("home_details_page_view");
  });

  it("should remove accents instead of dropping the letter", () => {
    expect(
      formatLabel({ parts: ["Início", "Ação"], stringFormat: "snake_case" })
    ).toBe("Inicio_Acao");
  });

  it("should split camelCase and PascalCase input into words", () => {
    expect(
      formatLabel({
        parts: ["userProfile", "HTTPError"],
        stringCase: "lowercase",
        stringFormat: "kebab-case",
      })
    ).toBe("user-profile-http-error");
  });

  it("should keep the original characters when stringFormat is 'raw'", () => {
    expect(
      formatLabel({ parts: ["hello@world!", "btn-1"], stringFormat: "raw" })
    ).toBe("hello@world! btn-1");
  });

  it("should apply stringCase to each word when stringFormat is 'raw'", () => {
    expect(
      formatLabel({
        parts: ["my page", "button"],
        stringCase: "capitalize",
        stringFormat: "raw",
      })
    ).toBe("My Page Button");
  });

  it("should trim the parts before formatting", () => {
    expect(formatLabel({ parts: ["  hello ", " world  "] })).toBe(
      "hello world"
    );
  });
});
