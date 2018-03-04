import * as Snabbdom from 'snabbdom-pragma'
import { MistakesListPage } from './pages/list'
import { data } from 'data'
import { Router } from 'router'
import { DOMSource } from 'renderer'
import { isTruly } from '../utils/is-truly'
import { MistakePage } from './pages/mistake'

import './style.css'
import { mistakeLink, isLocalLink } from './utils/routing'

interface IAppSources {
  DOM: DOMSource,
  router: Router,
}

export function main({ router, DOM }: IAppSources) {
  const allMistakes = data.mistakesGroups
    .map(group => group.mistakes)
    .reduce((acc, x) => acc.concat(x), [])

  const vdom$ = router.location$
    .map(location => {
      if (location.pathname.startsWith(mistakeLink(''))) {
        const mistakeId = location.pathname
          .replace(/.*mistake\//, '')
          .replace(/\//, '')

        const mistake = allMistakes.find(m => m.id === mistakeId)
        if (mistake) {
          return <MistakePage mistake={mistake} />
        }
      }
      return <MistakesListPage mistakesGroups={data.mistakesGroups} />
    })

  const linksRedirects$ = DOM.selectEvents<MouseEvent>('body', 'click')
    .filter(e => e.toElement.nodeName === 'A')
    .map(event => {
      const href = (event.toElement as HTMLAnchorElement).getAttribute('href')
      if (href && isLocalLink(href)) {
        event.preventDefault()
        return router.push(href)
      }

      return undefined
    })
    .filter(isTruly)

  return {
    DOM: vdom$,
    router: linksRedirects$,
  }
}
