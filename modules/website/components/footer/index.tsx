import * as Snabbdom from 'snabbdom-pragma'
import { Link } from '../../ui/link'
import { ColorMark } from '../../ui/color-mark'
const styles = require('./style.css')

export function Footer() {
  return (
    <footer>
      <ColorMark color="hsl(0, 0%, 40%)" />
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
