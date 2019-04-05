import xs, { Stream } from 'xstream'
import * as Snabbdom from '@eff/dom/h'
import toHTML = require('snabbdom-to-html')

export function toPromise<T>(stream: Stream<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    stream
      .last()
      .addListener({
        next(value: T) {
          resolve(value)
        },
        error: reject,
      })
  })
}

function composeEffFunctions(f: () => void, g: () => void) {
  return () => {
    f()
    g()
  }
}

function runFnEff(fn$: Stream<(() => void) | void>): Promise<void> {
  const finalFn$ = fn$.filter(Boolean).fold(composeEffFunctions, () => {})

  return toPromise(finalFn$).then(f => f())
}

function runWithEffs(app: any): { DOM: Promise<string>, fn: Promise<void> } {
  const sinks = app({ DOM: undefined, fn: undefined })

  return {
    DOM: toPromise<string>(sinks.DOM.map(toHTML)),
    fn: runFnEff(sinks.fn || xs.empty()),
  }
}

function run(app: any): Promise<string> {
  return runWithEffs(app).DOM
}

function invoke(fn: () => void) {
  return { effectType: 'fn', sink$: xs.of(fn) }
}


describe('jsx', () => {
  it('should render plain div', async () => {
    expect(await run(<div />)).toBe('<div></div>')
  })

  it('should render plain span', async () => {
    expect(await run(<span />)).toBe('<span></span>')
  })

  it('should render div with text child', async () => {
    expect(await run(<div>text</div>)).toBe('<div>text</div>')
  })

  it('should render div with span child', async () => {
    expect(await run(<div><span /></div>)).toBe('<div><span></span></div>')
  })

  it('should render div with two span children', async () => {
    expect(await run(<div><span /><span /></div>)).toBe('<div><span></span><span></span></div>')
  })

  it('should render div with text and span children', async () => {
    expect(await run(<div>text<span /></div>)).toBe('<div>text<span></span></div>')
  })

  it('should render div with text and span children. And span also has text child', async () => {
    expect(await run(<div>text<span>span text</span></div>)).toBe('<div>text<span>span text</span></div>')
  })

  it('should render div with array child with one text element', async () => {
    expect(await run(<div>{['text1']}</div>)).toBe('<div>text1</div>')
  })

  it('should render div with array child with two text elements', async () => {
    expect(await run(<div>{['text1', 'text2']}</div>)).toBe('<div>text1text2</div>')
  })

  it('should render div with array child with a text element and span element', async () => {
    expect(await run(<div>{['text1', <span />]}</div>)).toBe('<div>text1<span></span></div>')
  })

  it('should render div with array child with a text element and span element', async () => {
    expect(await run(<div>{['text1', <span>span text</span>]}</div>)).toBe('<div>text1<span>span text</span></div>')
  })

  it('should render div with stream of text child', async () => {
    expect(await run(<div>{xs.of('text')}</div>)).toBe('<div>text</div>')
  })

  it('should render div with stream of span child', async () => {
    expect(await run(<div>{xs.of(<span />)}</div>)).toBe('<div><span></span></div>')
  })

  it('should render div with stream of array child', async () => {
    expect(await run(<div>{xs.of([<span />, 'text'])}</div>)).toBe('<div><span></span>text</div>')
  })

  it('should render div with undefined child', async () => {
    expect(await run(<div>{undefined}</div>)).toBe('<div></div>')
  })

  it('should render div with null child', async () => {
    expect(await run(<div>{null}</div>)).toBe('<div></div>')
  })

  it('should render div with false child', async () => {
    expect(await run(<div>{false}</div>)).toBe('<div></div>')
  })

  it('should render div with true child', async () => {
    expect(await run(<div>{true}</div>)).toBe('<div>true</div>')
  })

  it('should render div with effect child', async () => {
    const fn = jest.fn()
    const effs = runWithEffs(<div>{invoke(fn)}</div>)
    expect(await effs.DOM).toBe('<div></div>')
    await effs.fn
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should render div with effect children', async () => {
    const fn = jest.fn()
    const fn2 = jest.fn()
    const effs = runWithEffs(
      <div>
        {invoke(fn)}
        {invoke(fn2)}
      </div>,
    )
    expect(await effs.DOM).toBe('<div></div>')
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(1)
  })

  it('should render div with number child', async () => {
    expect(await run(<div>{0}</div>)).toBe('<div>0</div>')
    expect(await run(<div>{1}</div>)).toBe('<div>1</div>')
  })

  it('should render simple component without props', async () => {
    function Button() {
      return <button>text</button>
    }

    expect(await run(<Button />)).toBe('<button>text</button>')
  })

  it('should render simple component with props', async () => {
    function Button(props: { type: 'button' | 'submit' }) {
      return <button type={props.type}>text</button>
    }

    expect(await run(<Button type="button" />)).toBe('<button type="button">text</button>')
  })

  it('should render simple component with child', async () => {
    function Button(props: { children?: any }) {
      return <button>{props.children}</button>
    }

    expect(await run(<Button>text</Button>)).toBe('<button>text</button>')
  })

  it('should render component inside div', async () => {
    function Button(props: { children?: any }) {
      return <button>{props.children}</button>
    }

    expect(await run(<div><Button /></div>)).toBe('<div><button></button></div>')
  })

  it('should render simple component with children', async () => {
    function Button(props: { children?: any }) {
      return <button>{props.children}</button>
    }

    expect(await run(<Button><span /><span /></Button>)).toBe('<button><span></span><span></span></button>')
  })

  it('should render simple component with streams children', async () => {
    function Button(props: { children?: any }) {
      return <button>{props.children}</button>
    }

    expect(await run(<Button>{xs.of(<span />)}{xs.of(1)}</Button>)).toBe('<button><span></span>1</button>')
  })

  it('should render simple component with component child', async () => {
    function Button(props: { children?: any }) {
      return <button>{props.children}</button>
    }

    expect(await run(<Button><Button/></Button>)).toBe('<button><button></button></button>')
  })

  it('should render simple component with stream of component child', async () => {
    function Button(props: { children?: any }) {
      return <button>{props.children}</button>
    }

    expect(await run(<Button>{xs.of(<Button/>)}</Button>)).toBe('<button><button></button></button>')
  })

  it('should render div with stream of span child', async () => {
    expect(await runWithEffs(<div>{xs.of(<span />)}</div>).DOM).toBe('<div><span></span></div>')
  })

  it('should render div with stream of effect child', async () => {
    const fn = jest.fn()
    const effs = runWithEffs(<div>{xs.of(invoke(fn))}</div>)
    expect(await effs.DOM).toBe('<div></div>')
    await effs.fn
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should render simple component with stream of component child', async () => {
    const checkSources = jest.fn()
    function Button(_props: any, sources: any) {
      checkSources(sources)
      return <button />
    }

    expect(await run(<Button />)).toBe('<button></button>')
    expect(checkSources).toHaveBeenCalledWith({ DOM: undefined, fn1: undefined })
  })
})
