import * as Snabbdom from 'snabbdom-pragma'
import { IMistakesGroup, IMistake } from 'data'
import { mistakeLink } from '../../utils/routing'
import { ColorMark } from '../../ui/color-mark'
const styles = require('./style.css')

function Mistake({ mistake }: { mistake: IMistake }) {
  return (
    <li className={styles.mistake}>
      <a className={styles.mistakeLink} href={mistakeLink(mistake.id)}>{mistake.shortName}</a>
    </li>
  )
}

function MistakesGroup({ group }: { group: IMistakesGroup }) {
  return (
    <div>
      <ColorMark color={group.color} />
      <ul className={styles.mistakesGroup}>
        {group.mistakes.map(mistake => <Mistake mistake={mistake} />)}
      </ul>
    </div>
  )
}

export function MistakesGroupsList(props: { mistakesGroups: IMistakesGroup[] }) {
  return props.mistakesGroups.map(group => <MistakesGroup group={group} />)
}
