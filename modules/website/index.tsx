import * as Snabbdom from 'snabbdom-pragma'
import { MistakesListPage } from './pages/list'
import { data } from 'data'
import { isTruly } from '../utils/is-truly'
import { MistakePage } from './pages/mistake'
import { AppSources, AppSinks } from './types'
import { mistakeLink, isLocalLink } from './utils/routing'
require('./style.css')

export function main({ router, DOM }: AppSources): AppSinks {
  const vdom$ = router.location$
    .map(location => {
      if (location.pathname.startsWith(mistakeLink(''))) {
        const mistakeId = location.pathname
          .replace(/.*mistake\//, '')
          .replace(/\//, '')

        const mistakeGroup = data.mistakesGroups.find(group => group.mistakes.some(m => m.id === mistakeId))
        const mistake = mistakeGroup && mistakeGroup.mistakes.find(m => m.id === mistakeId)

        if (mistakeGroup && mistake) {
          return <MistakePage mistake={mistake} color={mistakeGroup.color} />
        }
      }
      return <MistakesListPage mistakesGroups={data.mistakesGroups} />
    })

  const linksRedirects$ = DOM.selectEvents<MouseEvent>('body', 'click')
    .filter(e => (e.target as HTMLAnchorElement).nodeName === 'A')
    .map(event => {
      const href = (event.target as HTMLAnchorElement).getAttribute('href')
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
