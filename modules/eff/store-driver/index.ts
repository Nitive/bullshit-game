import xs, { Stream } from 'xstream'
import { Driver, Effect, selectEffectByType, EffectsDescriptor } from '../run'

interface StoreEffect<Action> extends Effect {
  effectType: 'store',
  sink$: Stream<Action>
}

export function storeEff<Action>(action$: Stream<Action>): StoreEffect<Action> {
  return {
    effectType: 'store',
    sink$: action$,
  }
}

export function selectStoreEff<Action>(vnode: EffectsDescriptor): Stream<Action> {
  return selectEffectByType<Action>('store', vnode, xs.merge)
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
      return selectStoreEff<Action>(effects)
    },
  }
}
