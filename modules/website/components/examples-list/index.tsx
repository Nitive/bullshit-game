import { h } from '@eff/dom/h'
import { Box } from '../../ui/box'
import { ColorMark } from '../../ui/color-mark'
const styles = require('./style.css')

export function ExamplesList(props: { examples: string[] }) {
  return (
    h('ul', { props: { className: styles.list } },
      props.examples.map(example => (
        h('li', { props: { className: styles.example } }, [
          ColorMark({ color: '#666' }),
          Box({ top: 20, bottom: 30 }, example),
        ])
      )),
    )
  )
}
