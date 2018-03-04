import * as Snabbdom from 'snabbdom-pragma'
import { IMistake } from 'data'

export function MistakePage({ mistake }: { mistake: IMistake }) {
  return (
    <div>
      <a href="/">← К списку ошибок</a>
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
