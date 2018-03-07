import 'utils/polyfills'
import { render, createDOMSource } from 'renderer'
import { createRouter } from 'router'
import createBrowserHistory from 'history/createBrowserHistory'
import { main } from '.'

function getNode() {
  const appNode = document.getElementById('app')
  if (appNode) {
    return appNode
  }

  const node = document.createElement('div')
  document.body.appendChild(node)

  return node
}

const history = createBrowserHistory()
const { router, runRouter } = createRouter(history)

const sources = {
  DOM: createDOMSource(),
  router,
}

const app = main(sources)

render(app.DOM, getNode())
runRouter(app.router)
