var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/main.js',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: path.join(__dirname, 'src'),
      loader: 'babel-loader',
      query: {
        presets: 'es2015',
      },
    }, {
      test: /\.less$/,
      loaders: ['style', 'css', 'less'],
      include: path.join(__dirname, 'src')
    }]
  },
  devServer: {
    contentBase: './dist',
    hot: true,
    inline: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ]
}
