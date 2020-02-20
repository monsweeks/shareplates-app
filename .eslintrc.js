module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['react', 'prettier'],
  env: {
    browser: true,
    node: true,
    mocha: true,
  },
  rules: {
    'max-length': 0,
    'import/no-unresolved' : 0,
    'import/no-named-as-default' : 0,
    'object-shorthand' : 0,
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'react/require-default-props': 'off',
  },
  globals: {
    jQuery: true,
    $: true,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: './config/webpack.config.js',
      },
    },
  },
};
