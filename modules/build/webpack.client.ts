import { Configuration } from 'webpack'
import * as path from 'path'
import { commonConfig, root, scriptsFolder, cssLoaderOptions, postcssLoader } from './webpack.common'
import { getEnv } from 'utils/get-env'
const HtmlWebpackPlugin = require('html-webpack-plugin')
const StatsPlugin = require('stats-webpack-plugin')

const config: Configuration = {
  ...commonConfig,
  entry: {
    main: ['website/init-browser-app'],
  },
  output: {
    path: path.join(root, scriptsFolder),
    publicPath: getEnv('ASSETS_PATH'),
    filename: '[name]/app.[hash].js',
  },
  module: {
    ...commonConfig.module,
    rules: [
      ...commonConfig.module.rules,
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: cssLoaderOptions },
          postcssLoader,
        ],
      },
    ],
  },
  plugins: [
    ...commonConfig.plugins,
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './template.ejs'),
    }),
    new StatsPlugin('stats.json'),
  ],
}

export default config
