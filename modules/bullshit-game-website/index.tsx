import * as Snabbdom from 'snabbdom-pragma'
import xs from 'xstream'
import { render } from 'renderer'
import { MistakesListPage } from './pages/list'
import { IAppData, data } from 'data'

interface IAppSources {
  data: IAppData
}

export default function app({ data }: IAppSources) {
  const vdom = <MistakesListPage mistakesGroups={data.mistakesGroups} />
  const vdom$ = xs.of(vdom)

  return {
    DOM: vdom$,
  }
}

const node = document.createElement('div')
document.body.appendChild(node)

const sources = {
  data,
}
render(app(sources).DOM, node)
