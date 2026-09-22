import es5 from 'eslint-config-kswedberg/flat/es5.mjs';
import {browserGlobals} from 'eslint-config-kswedberg/flat/globals.mjs';

export default [
  {
    ignores: ['node_modules', 'dist', 'build', 'coverage', '*.min.js', 'test/qunit/*.js']
  },
  ...es5,
  browserGlobals,
  {
    languageOptions: {
      globals: {
        jQuery: 'readonly',
        $: 'readonly',
        QUnit: 'readonly'
      }
    }
  },
  {
    files: ['src/**/*.js', 'test/*.js', 'Gruntfile.js'],

    rules: {
      'comma-dangle': ['warn', 'never'],
      'no-param-reassign': 'off',
      'newline-per-chained-call': 'off',
      'no-use-before-define': ['error',
        {functions: false}],
      'func-style': 'off'
    }
  }
];
