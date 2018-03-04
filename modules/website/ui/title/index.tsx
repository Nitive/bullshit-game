import * as Snabbdom from 'snabbdom-pragma'
const styles = require('./style.css')

export function Title(_props: {}, children?: Snabbdom.Children) {
  return (
    <h1 className={styles.container}>{children}</h1>
  )
}
