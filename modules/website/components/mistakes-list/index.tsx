import * as Snabbdom from 'snabbdom-pragma'
import { IMistakesGroup, IMistake } from 'data'
const styles = require('./style.css')

function Mistake({ mistake }: { mistake: IMistake }) {
  return (
    <li className={styles.mistake}>{mistake.shortName}</li>
  )
}

function MistakesGroup({ group }: { group: IMistakesGroup }) {
  return (
    <div>
      <div className={styles.colorMark} style={{ backgroundColor: group.color }} />
      <ul className={styles.mistakesGroup}>
        {group.mistakes.map(mistake => <Mistake mistake={mistake} />)}
      </ul>
    </div>
  )
}

export function MistakesGroupsList(props: { mistakesGroups: IMistakesGroup[] }) {
  return props.mistakesGroups.map(group => <MistakesGroup group={group} />)
}
