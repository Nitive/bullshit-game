import * as Snabbdom from 'snabbdom-pragma'
import { Link } from '../../ui/link'
const styles = require('./style.css')

export function Footer() {
  return (
    <footer>
      <div className={styles.line} />
      <div className={styles.text}>
        Напишите нам, если вы придумали показательный пример ошибки:{' '}
        <nobr>
          <Link className={styles.link} href="mailto:error@bullshit-the-game.ru">
            error@bullshit-the-game.ru
          </Link>
        </nobr>
      </div>
    </footer>
  )
}
