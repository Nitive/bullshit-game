import * as path from 'path'
import { Assets } from './render'


export function getAssetsFromStats(stats: any): Assets {
  const webpackAssets: string[] = stats.entrypoints.main.assets

  function findFile(ext: string): string | undefined {
    const file = webpackAssets.find(asset => asset.endsWith(ext))
    return file ? path.join(stats.publicPath, file) : undefined
  }

  return {
    js: findFile('.js')!,
    css: findFile('.css'),
  }
}
