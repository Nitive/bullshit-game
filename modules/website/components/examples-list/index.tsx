import * as Snabbdom from 'snabbdom-pragma'
import { ColorMark } from '../../ui/color-mark'
import { Box } from '../../ui/box'
const styles = require('./style.css')

export function ExamplesList(props: { examples: string[] }) {
  return (
    <ul className={styles.list}>
      {props.examples.map(example => (
        <li className={styles.example}>
          <ColorMark color="#666" />
          <Box top={20} bottom={30}>
            {example}
          </Box>
        </li>
      ))}
    </ul>
  )
}
