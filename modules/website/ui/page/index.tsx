import * as Snabbdom from 'snabbdom-pragma'
const styles = require('./style.css')

export function Page(_props: {}, children?: Snabbdom.Children) {
  return (
    <div className={styles.container}>{children}</div>
  )
}
