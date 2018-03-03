import toHTML = require('snabbdom-to-html')
import { data, IAppData } from 'data';
import { createRouter } from 'router';
import createMemoryHistory from 'history/createMemoryHistory';
import { main } from '../bullshit-game-website';
import xs, { Stream } from 'xstream';

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
    return app.DOM.take(1).map(toHTML)
}

function getPages(appData: IAppData) {
  const urls = getPossibleUrls(appData)

  return xs.combine(
    ...urls.map(path => renderPage(path).map(content => ({ path, content })))
  )
}

getPages(data)
  .addListener({
    next(pages) {
      console.log(pages)
    }
  })
