import eslintConfigPrettier from "eslint-config-prettier";
import typescriptEslint from "typescript-eslint";

export default typescriptEslint.config(
  {
    extends: [...typescriptEslint.configs.recommended],
  },
  eslintConfigPrettier,
);
