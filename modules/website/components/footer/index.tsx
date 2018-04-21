import h from '@eff/dom/h'
import { ColorMark } from '../../ui/color-mark'
import { Link } from '../../ui/link'
const styles = require('./style.css')

export function Footer() {
  return (
    h('footer', [
      ColorMark({ color: 'hsl(0, 0%, 40%)' }),
      h('div', { props: { className: styles.text } }, [
        h('span', 'Напишите нам, если вы придумали показательный пример ошибки: '),
        h('nobr', [
          Link({ className: styles.link, href: 'mailto:error@bullshit-the-game.ru' }, 'error@bullshit-the-game.ru'),
        ]),
      ]),
    ])
  )
}
