import h from '@eff/dom/h'
import * as Snabbdom from 'snabbdom-pragma'
import { VNodeData } from 'snabbdom/vnode'
import { cx } from 'utils/classnames'
import { Sources } from '../../types'
const styles = require('./style.css')

export function Link(_sources: Sources, props: VNodeData, children?: Snabbdom.Children) {
  return h('a', {
    props: {
      ...props,
      className: cx(props.className, styles.link),
    },
  }, children as any)
}
