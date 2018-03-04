import * as Snabbdom from 'snabbdom-pragma'
import toHTML = require('snabbdom-to-html')
import { data, IAppData } from 'data'
import { createRouter } from 'router'
import createMemoryHistory from 'history/createMemoryHistory'
import { main } from 'website'
import xs, { Stream } from 'xstream'
import * as path from 'path'
import mkdirp = require('mkdirp-promise')
import * as fs from 'mz/fs'
import { VNode } from 'snabbdom/vnode'
import { getEnv } from 'utils/get-env'

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

interface Assets {
  js: string,
}

function renderMainTemplate(content: VNode, assets: Assets) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Логические ошибки</title>
      </head>
      <body>
        <div id="app">
          {content}
        </div>
        <script src={assets.js}></script>
      </body>
    </html>
  )
}


function renderPage(path: string, assets: Assets): Stream<string> {
  const history = createMemoryHistory({ initialEntries: [path] })
  const { router } = createRouter(history)
  const app = main({ router })
  return app.DOM
    .take(1)
    .map(vdom => renderMainTemplate(vdom, assets))
    .map(toHTML)
    .map(html => '<!DOCTYPE html>' + html)
}

function renderPages(urls: string[], assets: Assets) {
  return xs.combine(
    ...urls.map(path => renderPage(path, assets).map(content => ({ path, content }))),
  )
}

const buildFolder = path.join(getEnv('ROOT'), getEnv('BUILD_FOLDER'))
const stats = require(path.join(getEnv('ROOT'), getEnv('STATS_PATH')))
const jsPath = path.join(getEnv('ASSETS_PATH'), stats.assetsByChunkName.main)

const assets = {
  js: jsPath,
}
const urls = getPossibleUrls(data)
const pages$ = renderPages(urls, assets)

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
        .catch(console.error)
    },
  })
