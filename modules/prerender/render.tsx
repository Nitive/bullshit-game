
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
import { Assets } from './assets-from-stats'

function renderMainTemplate(content: VNode, assets: Assets) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        {assets.css ? <link href={assets.css} rel="stylesheet" /> : undefined}
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


export function renderPage(pagePath: string, assets: Assets): Stream<string> {
  const appCodePath = path.join(getEnv('ROOT'), getEnv('ASSETS_FOLDER'), 'server/server.js')
  const { main: appMain } = require(appCodePath)
  const main: (sources: AppSources) => AppSinks = appMain

  const history = createMemoryHistory({ initialEntries: [pagePath] })
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
