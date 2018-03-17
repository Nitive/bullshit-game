import * as path from 'path'
import { commonConfig, root, scriptsFolder, cssLoaderOptions, postcssLoader } from './webpack.common'
import { getEnv } from 'utils/get-env'
import { HotModuleReplacementPlugin } from 'webpack'
const StatsPlugin = require('stats-webpack-plugin')

const devPlugins =  [
  new HotModuleReplacementPlugin(),
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
          'style-loader',
          { loader: 'css-loader', options: cssLoaderOptions },
          postcssLoader,
        ],
      },
    ],
  },
  plugins: [
    ...commonConfig.plugins,
    new StatsPlugin('stats.json'),
    ...commonConfig.mode === 'development' ? devPlugins : [],
  ],
}

export default config
