import { h } from '@eff/dom/h'
import { IMistake, IMistakesGroup } from 'data'
import { ColorMark } from '../../ui/color-mark'
import { mistakeLink } from '../../utils/routing'
const styles = require('./style.css')

function Mistake({ mistake }: { mistake: IMistake }) {
  return (
    h('li', { props: { className: styles.mistake } }, [
      h('a', { props: { className: styles.mistakeLink, href: mistakeLink(mistake.id) } }, mistake.shortName),
    ])
  )
}

function MistakesGroup({ group }: { group: IMistakesGroup }) {
  return (
    h('div', [
      ColorMark({ color: group.color }),
      h('ul', { props: { className: styles.mistakesGroup } }, [
        ...group.mistakes.map(mistake => Mistake({ mistake })),
      ]),
    ])
  )
}

export function MistakesGroupsList(props: { mistakesGroups: IMistakesGroup[] }) {
  return props.mistakesGroups.map(group => MistakesGroup({ group }))
}
