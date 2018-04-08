import xs, { Stream } from 'xstream'
import { Driver, Effect, selectEffectByType, EffectsDescriptor } from '../run'

interface StoreEffect<Action> extends Effect {
  effectType: 'store',
  action$: Stream<Action>
}

export function storeEff<Action>(action$: Stream<Action>): StoreEffect<Action> {
  return {
    effectType: 'store',
    action$,
  }
}

export function selectStoreEff<Action>(vnode: EffectsDescriptor): Stream<Action> {
  const merge = (acc: StoreEffect<Action>, x: StoreEffect<Action>): StoreEffect<Action> => {
    return storeEff(xs.merge(acc.action$, x.action$))
  }

  return selectEffectByType('store', vnode, merge, storeEff(xs.empty())).action$
}

export type StoreSource<State> = Stream<State>

export function makeStoreDriver<Action, State>(
  reducer: (state: State, action: Action) => State,
  initialState: State,
): Driver<Stream<Action>, StoreSource<State>> {
  return {
    run(action$) {
      return action$.fold(reducer, initialState)
    },
    select(effects): Stream<Action> {
      return selectStoreEff(effects)
    },
  }
}
