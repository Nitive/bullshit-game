import * as Snabbdom from 'snabbdom-pragma'
import fromEvent from 'xstream/extra/fromEvent'
import { render } from 'renderer'
import { MistakesListPage } from './pages/list'
import { data } from 'data'
import { createRouter, Router } from 'router'
import createBrowserHistory from 'history/createBrowserHistory'

interface IAppSources {
  router: Router,
}

export default function app({ router }: IAppSources) {
  const vdom$ = router.location$
    .map(location => {
      if (location.pathname.startsWith('/mistake/')) {
        return <div>mistake</div>
      }
      return <MistakesListPage mistakesGroups={data.mistakesGroups} />
    })

  return {
    DOM: vdom$,
    router: fromEvent(document.body, 'click')
      .fold(acc => ! acc, true)
      .map(x => router.push(x ? '/' : '/mistake/1/' ))
  }
}

const node = document.createElement('div')
document.body.appendChild(node)

const history = createBrowserHistory()
const { router, runRouter } = createRouter(history)

const sources = {
  router,
}

const a = app(sources)

render(a.DOM, node)
runRouter(a.router)
