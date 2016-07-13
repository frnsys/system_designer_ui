var path = require('path');

module.exports = {
  entry: './index',
  output: {
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.sass$/,
        loaders: [
          'style',
          'css',
          'autoprefixer?browsers=last 3 versions',
          'sass?outputStyle=expanded'
        ]
      },
      {
        test: /\.json$/,
        loaders: ['json']
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.sass'],
    modulesDirectories: ['node_modules']
  }
};

