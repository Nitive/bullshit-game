import { data } from 'data'
import xs from 'xstream'
import * as path from 'path'
import mkdirp = require('mkdirp-promise')
import * as fs from 'mz/fs'
import { getEnv } from 'utils/get-env'
import { renderPage } from './render'
import { getAssetsFromStats, Assets } from './assets-from-stats'
import { getPossibleUrls } from './get-possible-urls'

function renderPages(urls: string[], assets: Assets) {
  return xs.combine(
    ...urls.map(path => renderPage(path, assets).map(content => ({ path, content }))),
  )
}

const buildFolder = path.join(getEnv('ROOT'), getEnv('BUILD_FOLDER'))
const stats = require(path.join(getEnv('ROOT'), getEnv('STATS_PATH')))
const publicPath = getEnv('PUBLIC_PATH')

const urls = getPossibleUrls(data).map(url => path.join(publicPath, url))
const pages$ = renderPages(urls, getAssetsFromStats(stats))

pages$
  .addListener({
    next(pages) {
      const promises = pages.map(async page => {
        const pathWithoutPublicPath = page.path.slice(publicPath.length - 1)
        const folderPath = path.join(buildFolder, pathWithoutPublicPath)
        const filePath = path.join(folderPath, 'index.html')

        await mkdirp(folderPath)
        await fs.writeFile(filePath, page.content)
      })

      Promise.all(promises)
        .catch(err => {
          console.error(err)
        })
    },
    error(err) {
      throw new Error(err)
    },
  })
