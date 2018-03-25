export interface Assets {
  publicPath: string,
  js: string,
  css?: string, // no css in development mode
}

export function getAssetsFromStats(stats: any): Assets {
  const webpackAssets: string[] = stats.entrypoints.main.assets

  const js = webpackAssets.find(asset => asset.endsWith('.js'))
  const css = webpackAssets.find(asset => asset.endsWith('.css'))

  if (!js) {
    throw new Error(`Could not find js file in assets: ${JSON.stringify(webpackAssets, null, 2)}`)
  }

  if (!css && process.env.NODE_ENV === 'production') {
    throw new Error(`Could not find css file in assets: ${JSON.stringify(webpackAssets, null, 2)}`)
  }

  return { publicPath: stats.publicPath, js, css }
}
