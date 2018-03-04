import * as Snabbdom from 'snabbdom-pragma'
import { IMistakesGroup, IMistake } from 'data'

function Mistake({ mistake }: { mistake: IMistake }) {
  return (
    <li>{mistake.shortName}</li>
  )
}

function MistakesGroup({ group }: { group: IMistakesGroup }) {
  return (
    <ul data-colormark={group.color}>
      {group.mistakes.map(mistake => <Mistake mistake={mistake} />)}
    </ul>
  )
}

export function MistakesListPage({ mistakesGroups }: { mistakesGroups: IMistakesGroup[] }) {
  return (
    <div>
      <h1>Ошибки в аргументации</h1>
      <a href="/mistake/haha/">test</a>
      {mistakesGroups.map(group => <MistakesGroup group={group} />)}
    </div>
  )
}
