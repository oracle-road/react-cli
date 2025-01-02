import globals from "globals";
import pluginJs from "@eslint/js";
// import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  {
    rules: {
      semi: "error",
      "prefer-const": "error"
    },
    // 配置react版本
    settings: {
      react: {
        version: "detect" // 或者指定具体版本
      }
    }
  },
  pluginJs.configs.recommended,
  // ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
];