import toHTML = require('snabbdom-to-html')
import { data, IAppData } from 'data'
import { createRouter } from 'router'
import createMemoryHistory from 'history/createMemoryHistory'
import { main } from 'website'
import xs, { Stream } from 'xstream'
import * as path from 'path'
import mkdirp = require('mkdirp-promise')
import * as fs from 'mz/fs'

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

function renderPage(path: string): Stream<string> {
  const history = createMemoryHistory({ initialEntries: [path] })
  const { router } = createRouter(history)
  const app = main({ router })
  return app.DOM
    .take(1)
    .map(toHTML)
}

function renderPages(urls: string[]) {
  return xs.combine(
    ...urls.map(path => renderPage(path).map(content => ({ path, content }))),
  )
}

const folder = process.env.BUILD_FOLDER
if (!folder) {
  throw new Error('Specify BUILD_FOLDER env to run prerender')
}

const buildFolder = path.resolve(__dirname, '../../', folder)

const urls = getPossibleUrls(data)
const pages$ = renderPages(urls)

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
