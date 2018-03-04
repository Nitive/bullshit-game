import * as Snabbdom from 'snabbdom-pragma'
import { MistakesListPage } from './pages/list'
import { data } from 'data'
import { Router } from 'router'
import xs from 'xstream'

interface IAppSources {
  router: Router,
}

function createUrl(path: string) {
  const publicPath = process.env.PUBLIC_PATH || ''

  return path.startsWith('/')
    ? publicPath.replace(/\/$/, '') + path
    : path
}

export function main({ router }: IAppSources) {
  const vdom$ = router.location$
    .map(location => {
      if (location.pathname.startsWith(createUrl('/mistake/'))) {
        return <div>mistake</div>
      }
      return <MistakesListPage mistakesGroups={data.mistakesGroups} />
    })

  return {
    DOM: vdom$,
    router: xs.periodic(1000)
      .fold(acc => ! acc, true)
      .map(x => router.push(createUrl(x ? '/' : '/mistake/1/'))),
  }
}
