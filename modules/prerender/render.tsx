// import * as Snabbdom from 'snabbdom-pragma'
import toHTML = require('snabbdom-to-html')
import h from '@eff/dom/h'
import * as path from 'path'
import { VNode } from 'snabbdom/vnode'
import xs, { Stream } from 'xstream'
import { Assets } from './assets-from-stats'
import { Manifest, ManifestMeta } from './manifest-meta'

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


export function renderPage(_pagePath: string, assets: Assets, manifest: Manifest): Stream<string> {
  // const appCodePath = path.join(getEnv('ROOT'), getEnv('ASSETS_FOLDER'), 'server/server.js')
  // const { main: appMain } = require(appCodePath)
  // const main: (sources: Sources) => Sinks = appMain

  // const history = createMemoryHistory({ initialEntries: [pagePath] })
  // // const { router, runRouter } = createRouter(history)
  // const app = main({
  //   router,
  //   DOM: createDOMSource(),
  // })
  // runRouter(app.router)
  // run(main, {
  //   // DOM:
  //   router: makeRouterDriver(history),
  // })
  return xs.of(h('span', 'Loading...'))
    .map(vdom => renderMainTemplate(vdom, assets, manifest))
    .map(toHTML)
    .map(html => '<!DOCTYPE html>' + html)

//   return app.DOM
//     .take(1)
//     .map(vdom => renderMainTemplate(vdom, assets, manifest))
//     .map(toHTML)
//     .map(html => '<!DOCTYPE html>' + html)
}
