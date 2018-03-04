import * as Snabbdom from 'snabbdom-pragma'

interface BoxProps {
  top?: number | 'auto',
  left?: number | 'auto',
  right?: number | 'auto',
  bottom?: number | 'auto',
  x?: number | 'auto',
  y?: number | 'auto',
  containerClass?: string,
}

function styleValue(value: number | string | undefined): string {
  if (value === undefined || value === 0) {
    return ''
  }

  if (typeof value === 'number') {
    return `${value}px`
  }

  return value
}

export function Box(props: BoxProps, children?: Snabbdom.Children) {
  const { x, y } = props

  // tslint:disable:strict-boolean-expressions
  const style = {
    marginBottom: styleValue(props.bottom || y),
    marginLeft: styleValue(props.left || x),
    marginRight: styleValue(props.right || x),
    marginTop: styleValue(props.top || y),
  }
  // tslint:enable:strict-boolean-expressions

  return <div style={style} className={props.containerClass}>{children}</div>
}
