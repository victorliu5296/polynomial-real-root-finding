const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/demo/demo.ts',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'demo.js',
    path: path.resolve(__dirname, 'build'),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/demo/styles.css', to: 'styles.css' },
        { from: './src/demo/index.html', to: 'index.html' },
      ],
    }),
  ],
};