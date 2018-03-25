import * as path from 'path'
import { commonConfig, root, scriptsFolder, cssLoaderOptions, postcssLoader } from './webpack.common'
import { getEnv } from 'utils/get-env'
import { HotModuleReplacementPlugin } from 'webpack'
import { getPossibleUrls } from 'prerender/get-possible-urls'
import { data } from 'data'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StatsPlugin = require('stats-webpack-plugin')
const OfflinePlugin = require('offline-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')

function getExternals(publicPath: string) {
  return getPossibleUrls(data).map(url => path.join(publicPath, url))
}

const devPlugins =  [
  new HotModuleReplacementPlugin(),
]

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

const commonPlugins = [
  new StatsPlugin('stats.json'),
  new WebpackPwaManifest({
    name: 'Игра Bullshit',
    short_name: 'Bullshit',
    background_color: '#000',
    display: 'standalone',
    orientation: 'any',
    start_url: getEnv('PUBLIC_PATH'),
    scope: getEnv('PUBLIC_PATH'),
    inject: false,
    icons: [
      {
        src: path.resolve(__dirname, '../website/resources/bullshit-game-icon.png'),
        sizes: [96, 128, 192, 256, 384, 512],
      },
    ],
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
    ...commonPlugins,
    ...commonConfig.mode === 'production' ? prodPlugins : devPlugins,
  ],
}

export default config
