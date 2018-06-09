import h from '@eff/dom/h'
import { IMistakesGroup } from 'data'
import { Footer } from '../components/footer'
import { MistakesGroupsList } from '../components/mistakes-list'
import { Sources } from '../types'
import { Box } from '../ui/box'
import { Page } from '../ui/page'
import { Title } from '../ui/title'

export function MistakesListPage(sources: Sources, props: { mistakesGroups: IMistakesGroup[] }) {
  return (
    Page({}, [
      h('main', [
        Title({}, 'Ошибки в аргументации'),
        Box({ top: 30 }, MistakesGroupsList(sources, { mistakesGroups: props.mistakesGroups })),
      ]),
      Footer(sources),
    ])
  )
}
