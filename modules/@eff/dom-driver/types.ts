export type Children = any
export type Component<Props, Sources, Sinks>
  = (props: Props & { children?: Children }, sources: Sources) => Element<Sources, Sinks>
export type Element<Sources, Sinks> = (sources: Sources) => Sinks
