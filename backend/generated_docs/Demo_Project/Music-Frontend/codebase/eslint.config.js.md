**ESLint Configuration File**
==========================

### Overview

This module, `eslint.config.js`, is the primary configuration file for ESLint, a popular JavaScript linter. It defines the rules and settings for ESLint to enforce code quality and consistency throughout the project. The configuration is designed to work with the project's tech stack, which includes React, Vite, and JavaScript (ES6+ syntax).

### Functions/Classes

This module exports a single configuration object, which is an array of two objects. The first object specifies files to ignore, while the second object defines the ESLint configuration.

#### Configuration Object

```javascript
export default [
  {
    // ...
  },
  {
    // ...
  },
]
```

#### `ignores` Property

The `ignores` property specifies an array of file patterns to ignore during linting.

```javascript
{
  ignores: ['dist']
}
```

*   **Purpose:** Exclude the `dist` directory from linting.
*   **Usage Example:** This configuration tells ESLint to skip the `dist` directory, which typically contains compiled or bundled code.

#### `files` Property

The `files` property specifies a glob pattern for files to lint.

```javascript
{
  files: ['**/*.{js,jsx}']
}
```

*   **Purpose:** Lint all JavaScript files (`*.js` and `*.jsx`) recursively.
*   **Usage Example:** This configuration tells ESLint to lint all JavaScript files in the project, regardless of their location.

#### `languageOptions` Property

The `languageOptions` property defines language-specific settings.

```javascript
{
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
    parserOptions: {
      ecmaVersion: 'latest',
      ecmaFeatures: {
        jsx: true,
      },
      sourceType: 'module',
    },
  }
}
```

*   **Purpose:** Configure ESLint to support modern JavaScript features, including JSX.
*   **Usage Example:** This configuration enables ESLint to recognize and lint modern JavaScript syntax, including JSX, which is commonly used in React applications.

#### `plugins` Property

The `plugins` property specifies ESLint plugins to use.

```javascript
{
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
  }
}
```

*   **Purpose:** Enable ESLint plugins for React Hooks and React Refresh.
*   **Usage Example:** This configuration tells ESLint to use the React Hooks and React Refresh plugins, which provide additional rules and features for React applications.

#### `rules` Property

The `rules` property defines ESLint rules and their configurations.

```javascript
{
  rules: {
    ...js.configs.recommended.rules,
    ...reactHooks.configs.recommended.rules,
    'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  }
}
```

*   **Purpose:** Configure ESLint rules, including recommended rules from the `js` and `react-hooks` configurations.
*   **Usage Example:** This configuration tells ESLint to enforce various rules, including the `no-unused-vars` rule, which is configured to ignore variables that start with an uppercase letter or an underscore.

### Dependencies

This module imports the following dependencies:

*   `@eslint/js`: The ESLint JavaScript plugin.
*   `globals`: A module that provides global variables for ESLint.
*   `eslint-plugin-react-hooks`: The ESLint React Hooks plugin.
*   `eslint-plugin-react-refresh`: The ESLint React Refresh plugin.

### Usage Examples

To use this ESLint configuration, create a new file called `.eslintrc.json` in the root of your project and add the following content:

```json
{
  "extends": "./eslint.config.js"
}
```

Then, run ESLint using the following command:

```bash
npx eslint .
```

This will lint all JavaScript files in your project using the configuration defined in `eslint.config.js`.

### Edge Cases & Warnings

*   Make sure to update the `ignores` property to exclude any directories or files that should not be linted.
*   If you're using a different version of ECMAScript, update the `ecmaVersion` property accordingly.
*   Be cautious when configuring ESLint rules, as some rules may have unintended consequences or conflicts with other rules.
*   Regularly review and update your ESLint configuration to ensure it remains relevant and effective for your project.