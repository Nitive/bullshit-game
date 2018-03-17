
import * as Snabbdom from 'snabbdom-pragma'
import toHTML = require('snabbdom-to-html')
import { createRouter } from 'router'
import createMemoryHistory from 'history/createMemoryHistory'
import { Stream } from 'xstream'
import * as path from 'path'
import { VNode } from 'snabbdom/vnode'
import { getEnv } from 'utils/get-env'
import { createDOMSource } from 'renderer/server'
import { AppSinks, AppSources } from 'website/types'

const appCodePath = path.join(getEnv('ROOT'), getEnv('ASSETS_FOLDER'), 'server/server.js')
const { main: appMain } = require(appCodePath)
const main: (sources: AppSources) => AppSinks = appMain

export interface Assets {
  js: string,
}

function renderMainTemplate(content: VNode, assets: Assets) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&amp;subset=cyrillic" rel="stylesheet" />
        <title>Логические ошибки</title>
      </head>
      <body>
        <div id="app">
          {content}
        </div>
        <script async="async" src={assets.js}></script>
      </body>
    </html>
  )
}


export function renderPage(path: string, assets: Assets): Stream<string> {
  const history = createMemoryHistory({ initialEntries: [path] })
  const { router } = createRouter(history)
  const app = main({
    router,
    DOM: createDOMSource(),
  })
  return app.DOM
    .take(1)
    .map(vdom => renderMainTemplate(vdom, assets))
    .map(toHTML)
    .map(html => '<!DOCTYPE html>' + html)
}
