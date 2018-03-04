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
  const vdom$ = router.location$
    .map(location => {
      if (location.pathname.startsWith(mistakeLink(''))) {
        const mistakeId = location.pathname
          .replace(/.*mistake\//, '')
          .replace(/\//, '')

        const mistakeGroup = data.mistakesGroups.find(group => group.mistakes.some(m => m.id === mistakeId))
        const mistake = mistakeGroup && mistakeGroup.mistakes.find(m => m.id === mistakeId)
        console.log(mistakeGroup && mistake)
        if (mistakeGroup && mistake) {
          return <MistakePage mistake={mistake} color={mistakeGroup.color} />
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
