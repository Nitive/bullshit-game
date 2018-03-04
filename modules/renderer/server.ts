import xs, { Stream } from 'xstream'

import { DOMSource } from '.'

export function createDOMSource(): DOMSource {
  return {
    selectEvents<Event>(): Stream<Event> {
      return xs.never()
    },
  }
}
