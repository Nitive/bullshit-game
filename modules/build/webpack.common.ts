import { DefinePlugin } from 'webpack'
import { getEnv } from 'utils/get-env'

export const root = getEnv('ROOT')
export const scriptsFolder = getEnv('ASSETS_FOLDER')
export const mode = getEnv('NODE_ENV')

export const postcssLoader = { loader: 'postcss-loader', options: require('./postcss.config') }
export const cssLoaderOptions = {
  minimize: mode === 'production',
  modules: true,
  importLoaders: 1,
  localIdentName: '[local]_[hash:base64:5]',
}

export const commonConfig = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      'process.env.PUBLIC_PATH': JSON.stringify(getEnv('PUBLIC_PATH')),
      'process.env.NODE_ENV': JSON.stringify(getEnv('NODE_ENV')),
    }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
}
