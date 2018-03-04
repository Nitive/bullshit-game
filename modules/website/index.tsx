import * as Snabbdom from 'snabbdom-pragma'
import { MistakesListPage } from './pages/list'
import { data } from 'data'
import { Router } from 'router'
import { DOMSource } from 'renderer'
import { isTruly } from '../utils/is-truly'

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
  const vdom$ = router.location$
    .map(location => {
      if (location.pathname.startsWith(createUrl('/mistake/'))) {
        return <div>mistake</div>
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
