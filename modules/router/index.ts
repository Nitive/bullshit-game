
import xs, { Stream } from 'xstream'
import { History, Location } from 'history'

export type RouterAction
  = { type: 'push', location: string }
  | { type: 'replace', location: string }

export interface Router {
  location$: Stream<Location>,
  push(location: string): RouterAction,
  replace(location: string): RouterAction,
}

function getLocation$(history: History): Stream<Location> {
  let unlisten: () => void

  return xs
    .create<Location>({
      start(listener) {
        unlisten = history.listen(location => {
          listener.next(location)
        })
      },
      stop() {
        unlisten()
      },
    })
    .startWith(history.location)
}

function handleRouterAction(history: History) {
  return (action: RouterAction) => {
    switch (action.type) {
      case 'push':
        history.push(action.location)
        break

      case 'replace':
        history.replace(action.location)
        break
    }
  }
}

export function createRouter(history: History): { router: Router, runRouter: (action$: Stream<RouterAction>) => void } {
  const location$ = getLocation$(history)
  const router = {
    location$,
    push(location: string): RouterAction {
      return { type: 'push', location }
    },
    replace(location: string): RouterAction {
      return { type: 'replace', location }
    },
  }

  function runRouter(action$: Stream<RouterAction>) {
    action$
      .addListener({
        next: handleRouterAction(history),
      })
  }

  return { router, runRouter }
}
