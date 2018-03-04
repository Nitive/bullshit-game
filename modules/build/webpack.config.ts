import { Configuration } from 'webpack'
import * as path from 'path'
// tslint:disable-next-line:variable-name
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config: Configuration = {
  entry: {
    main: ['website/init-browser-app'],
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: '[name]/app.[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
}

export default config
