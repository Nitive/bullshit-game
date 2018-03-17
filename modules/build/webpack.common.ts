import { DefinePlugin } from 'webpack'
import { getEnv } from 'utils/get-env'

export const root = getEnv('ROOT')
export const scriptsFolder = getEnv('ASSETS_FOLDER')
type Mode = 'development' | 'production'
const mode = getEnv<Mode>('NODE_ENV', (mode): mode is Mode => ['development', 'production'].includes(mode))

export const postcssLoader = { loader: 'postcss-loader', options: require('./postcss.config') }
export const cssLoaderOptions = {
  minimize: mode === 'production',
  modules: true,
  importLoaders: 1,
  localIdentName: '[local]_[hash:base64:5]',
}

export const commonConfig = {
  mode,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      {
        test: /\.(eot|woff2|woff|ttf)/,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      'process.env.PUBLIC_PATH': JSON.stringify(getEnv('PUBLIC_PATH')),
      'process.env.NODE_ENV': JSON.stringify(mode),
    }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
}
