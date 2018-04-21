import { default as snabbdomH } from 'snabbdom/h'
import { VNode, VNodeData } from 'snabbdom/vnode'
import { Stream } from 'xstream'

export type VNodesSparse = VNode | Stream<VNode> | Array<Stream<VNode> | VNode | undefined | null>
export function h(sel: string): VNode
export function h(sel: string, data: VNodeData): VNode
export function h(sel: string, text: string): VNode
export function h(sel: string, children: VNodesSparse): VNode
export function h(sel: string, data: VNodeData, text: string): VNode
export function h(sel: string, data: VNodeData, children: VNodesSparse): VNode
export function h(...args: any[]): any {
  return (snabbdomH as any)(...args)
}
export default h
