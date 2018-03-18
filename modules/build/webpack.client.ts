import * as path from 'path'
import { commonConfig, root, scriptsFolder, cssLoaderOptions, postcssLoader } from './webpack.common'
import { getEnv } from 'utils/get-env'
import { HotModuleReplacementPlugin } from 'webpack'
import { getPossibleUrls } from '../prerender/get-possible-urls'
import { data } from 'data'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StatsPlugin = require('stats-webpack-plugin')
const OfflinePlugin = require('offline-plugin')

const devPlugins =  [
  new HotModuleReplacementPlugin(),
]

function getExternals(publicPath: string) {
  return getPossibleUrls(data).map(url => path.join(publicPath, url))
}

const prodPlugins = [
  new MiniCssExtractPlugin({
    filename: '[name]/styles.[hash].css',
  }),
  new OfflinePlugin({
    appShell: '/',
    ServiceWorker: {
      output: '../sw.js',
      minify: false,
    },
    externals: getExternals(getEnv('PUBLIC_PATH')),
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
    ...commonConfig.mode === 'production' ? prodPlugins : devPlugins,
    new StatsPlugin('stats.json'),
  ],
}

export default config
