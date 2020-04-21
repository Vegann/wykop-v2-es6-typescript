module.exports = {
  "env": {
    "es6": true,
    "node": true,
    "jest": true
  },
  "extends": [
    "airbnb-base",
    "plugin:prettier/recommended"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "jest",
    "@typescript-eslint",
  ],
  "rules": {
    "max-len": ["error", { "code": 100 }],
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  }
};
