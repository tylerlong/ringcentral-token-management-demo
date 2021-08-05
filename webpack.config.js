const HtmlWebpackPlugin = require('html-webpack-plugin');

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
  ],
}

module.exports = config;
