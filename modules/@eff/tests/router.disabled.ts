// import xs, { Stream } from 'xstream'
// import fromDiagram from 'xstream/extra/fromDiagram'
// import { run } from '@eff/core/run'
// import { RouterSource, RouterAction, routerEff, makeRouterDriver } from '@eff/router'
// import { areStreamsEqual } from './test-utils'
// import { createMemoryHistory } from 'history'
// import { Element } from '@eff/dom/types'

// describe('router', () => {
//   it('router eff should works', done => {
//     interface Sources {
//       router: RouterSource
//     }

//     interface Sinks {
//       router: Stream<RouterAction>
//     }

//     const app: Element<Sources, Sinks> = sources => {
//       const expected = fromDiagram('0-1-3|', { values: { 0: '/', 1: '/test', 3: '/test2' } })
//       const pathname$ = sources.router.location$.map(x => x.pathname)
//       areStreamsEqual(pathname$, expected).then(done).catch(done)

//       return (
//         routerEff(xs.from<RouterAction>([
//           { type: 'push', location: '/test' },
//           { type: 'push', location: '/test2' },
//         ]))
//       )
//     }

//     const history = createMemoryHistory()

//     run(app, {
//       router: makeRouterDriver(history),
//     })
//   })
// })
