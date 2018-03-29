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
import { ManifestMeta, Manifest } from './manifest-meta'

function renderMainTemplate(content: VNode, assets: Assets, manifest: Manifest) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        {assets.css && <link href={path.join(assets.publicPath, assets.css)} rel="stylesheet" />}
        <script defer src={path.join(assets.publicPath, assets.js)}></script>
        <ManifestMeta publicPath={assets.publicPath} manifest={manifest} />
        <title>Логические ошибки</title>
      </head>
      <body>
        <div id="app">
          {content}
        </div>
      </body>
    </html>
  )
}


export function renderPage(pagePath: string, assets: Assets, manifest: Manifest): Stream<string> {
  const appCodePath = path.join(getEnv('ROOT'), getEnv('ASSETS_FOLDER'), 'server/server.js')
  const { main: appMain } = require(appCodePath)
  const main: (sources: AppSources) => AppSinks = appMain

  const history = createMemoryHistory({ initialEntries: [pagePath] })
  const { router, runRouter } = createRouter(history)
  const app = main({
    router,
    DOM: createDOMSource(),
  })
  runRouter(app.router)

  return app.DOM
    .take(1)
    .map(vdom => renderMainTemplate(vdom, assets, manifest))
    .map(toHTML)
    .map(html => '<!DOCTYPE html>' + html)
}
