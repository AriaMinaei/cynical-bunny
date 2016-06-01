WebpackErrorNotificationPlugin = require('webpack-error-notification');
webpack = require('webpack');

function makeConfig() {
  return {
    entry: {
      index: ['./src/index']
    },
    target: 'node',
    output: {
      path: './dist',
      filename: '[name].js',
      publicPath: '/dist/',
      libraryTarget: 'umd',
      library: 'theTestingFramework'
    },
    externals: [
      // all none-relative paths are external
      /^[a-z\-0-9]+/
    ],

    resolve: {
      extensions: ['.js', '.json']
    },

    devtool: 'source-map',
    module: {
      loaders: [
          {test: /\.json$/, loader: 'json'},
          {test: /\.js$/, loader: 'babel', exclude: /(node_modules)/}
        ]
      },
    plugins: [
      (new webpack.NoErrorsPlugin()),
      (new WebpackErrorNotificationPlugin())
      ]
    }
}

module.exports = makeConfig()
