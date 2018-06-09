import { run } from '@eff/core/run'
import { makeDomDriver } from '@eff/dom/client'
import { makeRouterDriver } from '@eff/router'
import createBrowserHistory from 'history/createBrowserHistory'
import 'utils/polyfills'
import { main } from '.'

const history = createBrowserHistory()

run(main, {
  DOM: makeDomDriver('#app'),
  router: makeRouterDriver(history),
})


if (process.env.NODE_ENV === 'production') {
  import('offline-plugin/runtime').then(offline => {
    offline.install()
  })
}
