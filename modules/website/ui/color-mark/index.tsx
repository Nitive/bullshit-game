import * as Snabbdom from 'snabbdom-pragma'
const styles = require('./style.css')

export function ColorMark(props: { color: string }) {
  return <div className={styles.container} style={{ backgroundColor: props.color }} />
}
