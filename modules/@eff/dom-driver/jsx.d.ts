import { VNodeData } from 'snabbdom/vnode'
import { createElement as _createElement } from './h';

export = EffPragma

declare namespace EffPragma {
  // type Children = VNode[] | VNode | string | number
  // type CircularChildren = Children | Children[]

  // type Component = (props: VNodeData, children: CircularChildren[]) => VNode

  // export default function createElement<P>(component: string | Component<P>, props: P, children: Effects): Element {
  // export function createElement(sel: string | Component, data: null | VNodeData, ...children: CircularChildren[]): VNode
  export type createElement = typeof _createElement
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: VNodeData
    }
  }
}
