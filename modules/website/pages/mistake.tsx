import * as Snabbdom from 'snabbdom-pragma'
import { IMistake } from 'data'
import { ToList } from '../components/to-list'

export function MistakePage({ mistake }: { mistake: IMistake }) {
  return (
    <div>
      <ToList />
      <div>
        <span>{mistake.shortName}</span>
        <h1>{mistake.fullName}</h1>
        <ul>
          {mistake.examples.map(example => (
            <li>{example}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
