module.exports = {
  'rules': {
    'indent': [2, 4],
    'linebreak-style': [2, 'unix'],
    // 'semi': [2, 'always'],
    'no-constant-condition': 0,
    'no-console': 0,
    'no-unused-vars': 1,
    'no-debugger': 1,
    'comma-dangle': 0
  },
  'env': {
    'es6': true,
    'node': true,
    'mocha': true,
    'browser': true,
    'commonjs': true
  },
  'parser': 'babel-eslint',
  'extends': 'eslint:recommended',
  'globals': {
    'expect': true
  }
};
