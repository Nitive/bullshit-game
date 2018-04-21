// import * as Snabbdom from 'snabbdom-pragma'
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
import h from '@eff/dom/h'

function renderMainTemplate(content: VNode, assets: Assets, manifest: Manifest) {
  return (
    h('html', { props: { lang: 'en' } }, [
      h('head', [
        h('meta', { props: { charset: 'UTF-8' } }),
        h('meta', { props: { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' } }),
        h('meta', { props: { httpEquiv: 'X-UA-Compatible', content: 'ie=edge' } }),
        assets.css && h('link', { props: { href: path.join(assets.publicPath, assets.css), rel: 'stylesheet' } }),
        h('script', { props: { defer: true, src: path.join(assets.publicPath, assets.js) } }),
        ManifestMeta({ publicPath: assets.publicPath, manifest }),
        h('title', 'Логические ошибки'),
      ]),
      h('body', [
        h('div', { props: { id: 'app' } }, content),
      ]),
    ])
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
