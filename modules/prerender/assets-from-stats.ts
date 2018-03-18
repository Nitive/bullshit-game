import * as path from 'path'

export interface Assets {
  js: string,
  css?: string, // no css in development mode
}

export function getAssetsFromStats(stats: any): Assets {
  const webpackAssets: string[] = stats.entrypoints.main.assets

  function withPublicPath(file: string) {
    return path.join(stats.publicPath, file)
  }

  function findFile(ext: string): string | undefined {
    const file = webpackAssets.find(asset => asset.endsWith(ext))
    return file ? withPublicPath(file) : undefined
  }

  return {
    js: findFile('.js')!,
    css: findFile('.css'),
  }
}
