import * as Snabbdom from 'snabbdom-pragma'
import { listLink } from '../../utils/routing'
const styles = require('./style.css')

export function ToList() {
  return <a className={styles.link} href={listLink()}>￩ К списку ошибок</a>
}
