import { data, IAppData } from 'data'
import xs from 'xstream'
import * as path from 'path'
import mkdirp = require('mkdirp-promise')
import * as fs from 'mz/fs'
import { getEnv } from 'utils/get-env'
import { renderPage, Assets } from './render'
import { getAssetsFromStats } from './assets-from-stats'

function getPossibleUrls(appData: IAppData): string[] {
  const mistakesUrls = appData.mistakesGroups
    .map(group => group.mistakes)
    .reduce((acc, mistakes) => [...acc, ...mistakes], [])
    .map(mistake => `/mistake/${mistake.id}/`)

  return [
    '/',
    ...mistakesUrls,
  ]
}

function renderPages(urls: string[], assets: Assets) {
  return xs.combine(
    ...urls.map(path => renderPage(path, assets).map(content => ({ path, content }))),
  )
}

const buildFolder = path.join(getEnv('ROOT'), getEnv('BUILD_FOLDER'))
const stats = require(path.join(getEnv('ROOT'), getEnv('STATS_PATH')))

const urls = getPossibleUrls(data)
const pages$ = renderPages(urls, getAssetsFromStats(stats))

pages$
  .addListener({
    next(pages) {
      const promises = pages.map(async page => {
        const folderPath = path.join(buildFolder, page.path)
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
