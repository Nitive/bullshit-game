import { h } from '@eff/dom/h'
import { IMistake, IMistakesGroup } from 'data'
import { ColorMark } from '../../ui/color-mark'
import { mistakeLink } from '../../utils/routing'
import { Link } from '../link'
import { Sources } from '../../types'
const styles = require('./style.css')

function Mistake(sources: Sources, { mistake }: { mistake: IMistake }) {
  return (
    h('li', { props: { className: styles.mistake } }, [
      Link(
        sources,
        { className: styles.mistakeLink, href: mistakeLink(mistake.id) },
        mistake.shortName,
      ) as any,
    ])
  )
}

function MistakesGroup(sources: Sources, { group }: { group: IMistakesGroup }) {
  return (
    h('div', [
      ColorMark({ color: group.color }),
      h('ul', { props: { className: styles.mistakesGroup } }, [
        ...group.mistakes.map(mistake => Mistake(sources, { mistake })),
      ]),
    ])
  )
}

export function MistakesGroupsList(sources: Sources, props: { mistakesGroups: IMistakesGroup[] }) {
  return props.mistakesGroups.map(group => MistakesGroup(sources, { group }))
}
