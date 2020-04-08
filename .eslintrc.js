module.exports = {
  "env": {
    "es6": true,
    "node": true,
    "jest": true
  },
  "extends": [
    "airbnb-base",
    "plugin:you-dont-need-lodash-underscore/compatible",
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
    "you-dont-need-lodash-underscore"
  ],
  "rules": {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "ts": "never",
      }
    ]
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  }
};
