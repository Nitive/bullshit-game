import * as path from 'path'
import { commonConfig, cssLoaderOptions, postcssLoader, root, scriptsFolder } from './webpack.common'

const config = {
  ...commonConfig,
  target: 'node',
  entry: {
    server: ['website'],
  },
  output: {
    path: path.join(root, scriptsFolder, 'server'),
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    ...commonConfig.module,
    rules: [
      ...commonConfig.module.rules,
      {
        test: /\.css$/,
        use: [
          { loader: 'css-loader/locals', options: cssLoaderOptions },
          postcssLoader,
        ],
      },
    ],
  },
}

export default config
