import 'utils/polyfills'
import { render, createDOMSource } from 'renderer'
import { createRouter } from 'router'
import createBrowserHistory from 'history/createBrowserHistory'
import { main } from '.'

const history = createBrowserHistory()
const { router, runRouter } = createRouter(history)

const sources = {
  DOM: createDOMSource(),
  router,
}

const app = main(sources)

render(app.DOM, document.getElementById('app')!)
runRouter(app.router)

if (process.env.NODE_ENV === 'production') {
  import('offline-plugin/runtime').then(offline => {
    offline.install()
  })
}
