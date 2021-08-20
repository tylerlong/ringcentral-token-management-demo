const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv-override-true');
const {DefinePlugin} = require('webpack');

const config = {
  mode: "development",
  devtool: 'source-map',
  resolve: {
    fallback: {
       "crypto": require.resolve("crypto-browserify"),
       "buffer": require.resolve("buffer/"),
       "stream": require.resolve("stream-browserify"),
      }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new DefinePlugin({
      'process.env': JSON.stringify(dotenv.config().parsed),
    }),
  ],
}

module.exports = config;
