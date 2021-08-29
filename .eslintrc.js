module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "mocha"],
  env: {
    commonjs: true,
    es6: true,
    node: true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "@typescript-eslint/ban-ts-comment": ["error", { "ts-expect-error": "allow-with-description" }],
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-misused-promises": ["off", { ignoreVoid:true }],
    "@typescript-eslint/brace-style": ["error", "1tbs"],
    "@typescript-eslint/keyword-spacing": [
      "error", {
        before: true,
        // overrides: {
        //   from: { before: true },
        //   as: { before: true },
        //   else: { before: true },
        //   catch: { before: true },
        //   new: { before: true },
        //   return: { before: true },
        // },
      },
    ],
    "@typescript-eslint/object-curly-spacing": ["error", "always"],
    "@typescript-eslint/space-before-function-paren": [
      "error", {
        anonymous: "always",
        named: "never",
        asyncArrow: "always",
      },
    ],
    "@typescript-eslint/type-annotation-spacing": "error",
    "space-before-blocks": "error",
    "@typescript-eslint/require-await": "warn",
    "@typescript-eslint/prefer-regexp-exec": "off",

    // TODO Fix issues related to these rules
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-explicit-any": "off",
  }
};
