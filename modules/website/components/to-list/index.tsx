import { Sources } from '../../types'
import { listLink } from '../../utils/routing'
import { Link } from '../link'
const styles = require('./style.css')

export function ToList(sources: Sources) {
  return Link(sources, { className: styles.link, href: listLink() }, '￩ К списку ошибок')
}
