import { MistakesListPage } from './pages/list'
import { data } from 'data'
import { MistakePage } from './pages/mistake'
import { Sources } from './types'
import { isMistakeLink } from './utils/routing'
require('./style.css')

export function main(sources: Sources) {
  const vdom$ = sources.router.location$
    .map(location => {
      if (isMistakeLink(location.pathname)) {
        const mistakeId = location.pathname
          .replace(/.*mistake\//, '')
          .replace(/\//, '')

        const mistakeGroup = data.mistakesGroups.find(group => group.mistakes.some(m => m.id === mistakeId))
        const mistake = mistakeGroup && mistakeGroup.mistakes.find(m => m.id === mistakeId)

        if (mistakeGroup && mistake) {
          return MistakePage(sources, { mistake, color: mistakeGroup.color })
        }
      }
      return MistakesListPage(sources, { mistakesGroups: data.mistakesGroups })
    })

  // const linksRedirects$ = DOM.selectEvents<MouseEvent>('body', 'click')
  //   .filter(e => (e.target as HTMLAnchorElement).nodeName === 'A')
  //   .map(event => {
  //     const href = (event.target as HTMLAnchorElement).getAttribute('href')
  //     if (href && isLocalLink(href)) {
  //       event.preventDefault()
  //       return router.push(href)
  //     }

  //     return undefined
  //   })
  //   .filter(isTruly)

  return vdom$
}
