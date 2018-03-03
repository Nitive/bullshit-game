import { render } from 'renderer'
import { createRouter } from 'router'
import createBrowserHistory from 'history/createBrowserHistory'
import { main } from '.';

const node = document.createElement('div')
document.body.appendChild(node)

const history = createBrowserHistory()
const { router, runRouter } = createRouter(history)

const sources = {
  router,
}

const app = main(sources)

render(app.DOM, node)
runRouter(app.router)
