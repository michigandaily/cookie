module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  plugins: ["prettier"],
  rules: {
    "no-var": "error",
    "prefer-const": "error",
    "prefer-template": "error",
    "template-curly-spacing": "error",
    "prefer-arrow-callback": "error",
    "arrow-spacing": "error",
    eqeqeq: "error",
    "prettier/prettier": "error",
  },
};
