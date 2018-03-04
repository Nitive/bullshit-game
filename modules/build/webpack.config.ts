import { Configuration, DefinePlugin } from 'webpack'
import * as path from 'path'
import { getEnv } from 'utils/get-env'
const HtmlWebpackPlugin = require('html-webpack-plugin')
const StatsPlugin = require('stats-webpack-plugin')

const root = getEnv('ROOT')
const scriptsFolder = getEnv('ASSETS_FOLDER')

const config: Configuration = {
  entry: {
    main: ['website/init-browser-app'],
  },
  output: {
    path: path.join(root, scriptsFolder),
    filename: '[name]/app.[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[local]_[hash:base64:5]',
            },
          },
          { loader: 'postcss-loader', options: require('./postcss.config') },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './template.ejs'),
    }),
    new StatsPlugin('stats.json'),
    new DefinePlugin({
      'process.env.PUBLIC_PATH': JSON.stringify(getEnv('PUBLIC_PATH')),
    }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
}

export default config
