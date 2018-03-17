import * as path from 'path'
import { commonConfig, root, scriptsFolder, cssLoaderOptions, postcssLoader } from './webpack.common'
import { getEnv } from 'utils/get-env'
import { HotModuleReplacementPlugin } from 'webpack'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StatsPlugin = require('stats-webpack-plugin')

const devPlugins =  [
  new HotModuleReplacementPlugin(),
]

const prodPlugins = [
  new MiniCssExtractPlugin({
    filename: '[name]/styles.[hash].css',
  }),
]

const config = {
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
          commonConfig.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: cssLoaderOptions },
          postcssLoader,
        ],
      },
    ],
  },
  plugins: [
    ...commonConfig.plugins,
    new StatsPlugin('stats.json'),
    ...commonConfig.mode === 'production' ? prodPlugins : devPlugins,
  ],
}

export default config
