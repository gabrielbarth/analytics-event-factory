// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: ["**/dist/**"],
    rules: {
      "no-console": "off",
      eqeqeq: ["error", "always"],
      semi: ["error", "always"],
    },
  }
);
