import * as Snabbdom from 'snabbdom-pragma'
import { MistakesListPage } from './pages/list'
import { data } from 'data'
import { Router } from 'router'
import { DOMSource } from 'renderer'
import { isTruly } from '../utils/is-truly'
import { MistakePage } from './pages/mistake'

import './style.css'

interface IAppSources {
  DOM: DOMSource,
  router: Router,
}

function isLocalLink(link: string) {
  return link.startsWith('/') && ! link.startsWith('//')
}

function createUrl(path: string) {
  const publicPath = process.env.PUBLIC_PATH || ''

  return isLocalLink(path)
    ? publicPath.replace(/\/$/, '') + path
    : path
}

export function main({ router, DOM }: IAppSources) {
  const allMistakes = data.mistakesGroups
    .map(group => group.mistakes)
    .reduce((acc, x) => acc.concat(x), [])

  const vdom$ = router.location$
    .map(location => {
      if (location.pathname.startsWith(createUrl('/mistake/'))) {
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
      if (href && href.startsWith('/')) {
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
