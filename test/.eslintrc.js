module.exports = {
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "es6": true,
    "commonjs": true,
    "node": true,
    "mocha": true
  },
  "globals": {
    "module": true,
    "require": true,
    "__dirname": true,
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "never"
    ]
  }
};
