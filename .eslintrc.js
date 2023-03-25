module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2021, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  settings: {
    react: {
      version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  extends: [
    "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
    "plugin:react-hooks/recommended", //Uses the recommended rules from @eslint-plugin-react-hooks
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "plugin:testing-library/react",
    "prettier", // Make sure this is always the last configuration in the extends array.
  ],
  plugins: ["unused-imports", "no-only-tests"],
  ignorePatterns: ["test/setup.js", "test/babel-register.js"],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    "unused-imports/no-unused-imports": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react/no-string-refs": "off",
    "no-only-tests/no-only-tests": "error",
  },
};
