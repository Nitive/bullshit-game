import { Configuration } from 'webpack'
import * as path from 'path'
const HtmlWebpackPlugin = require('html-webpack-plugin')

// const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const config: Configuration = {
  entry: {
    main: ['bullshit-game-website'],
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
    new HtmlWebpackPlugin()
  ],
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx']
  }
}

export default config
