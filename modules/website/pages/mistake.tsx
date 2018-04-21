import h from '@eff/dom/h'
import { IMistake } from 'data'
import { ExamplesList } from '../components/examples-list'
import { Footer } from '../components/footer'
import { ToList } from '../components/to-list'
import { Box } from '../ui/box'
import { ColorMark } from '../ui/color-mark'
import { Page } from '../ui/page'
import { Title } from '../ui/title'

export function MistakePage(props: { mistake: IMistake, color: string }) {
  const { mistake } = props
  return (
    Page({}, [
      ToList(),
      Box({ top: 25, bottom: 15 }, [
        ColorMark({ color: props.color }),
      ]),
      h('span', mistake.shortName),
      Box({ top: 10, bottom: 30 }, [
        Title({}, mistake.fullName),
      ]),
      ExamplesList({ examples: mistake.examples }),
      Footer(),
    ])
  )
}
