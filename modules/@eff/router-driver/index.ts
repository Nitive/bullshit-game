import xs, { Stream } from 'xstream'
import { Driver, Effect, EffectsDescriptor } from '@eff/core/run'
import { selectEffectByType } from '@eff/core/select'
import { History, Location } from 'history'

export type RouterAction
  = { type: 'push', location: string }
  | { type: 'replace', location: string }

export interface RouterEffect extends Effect {
  effectType: 'router',
  sink$: Stream<RouterAction>
}

export function routerEff(action$: Stream<RouterAction>): RouterEffect {
  return {
    effectType: 'router',
    sink$: action$,
  }
}

export function selectRouterEff<Action>(vnode: EffectsDescriptor): Stream<Action> {
  return selectEffectByType<Action>('router', vnode, xs.merge)
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

export class RouterSource {
  location$: Stream<Location>

  constructor(history: History, action$: Stream<RouterAction>) {
    this.location$ = getLocation$(history).endWhen(action$.last())
    action$.addListener({
      next: handleRouterAction(history),
      error(err) {
        throw new Error(err)
      },
    })
  }

  push(location: string): RouterAction {
    return { type: 'push', location }
  }

  replace(location: string): RouterAction {
    return { type: 'replace', location }
  }
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


export function makeRouterDriver(history: History): Driver<Stream<RouterAction>, RouterSource> {
  return {
    run(action$) {
      return new RouterSource(history, action$)
    },
    select(effects): Stream<RouterAction> {
      return selectRouterEff(effects)
    },
  }
}
