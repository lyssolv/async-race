import type { Config } from 'prettier';

const config: Config = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',

  jsxSingleQuote: false,
  endOfLine: 'lf',
  proseWrap: 'preserve',
};

export default config;
