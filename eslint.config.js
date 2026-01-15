import typescriptEslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default typescriptEslint.config(
  {
    extends: [...typescriptEslint.configs.recommended],
  },
  eslintConfigPrettier,
);
