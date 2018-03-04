import * as Snabbdom from 'snabbdom-pragma'
import { IMistake } from 'data'
import { ToList } from '../components/to-list'
import { ColorMark } from '../ui/color-mark'
import { Box } from '../ui/box'
import { Title } from '../ui/title'
import { ExamplesList } from '../components/examples-list'
import { Footer } from '../components/footer'

export function MistakePage(props: { mistake: IMistake, color: string }) {
  const { mistake } = props
  return (
    <div>
      <ToList />
      <Box top={25} bottom={15}>
        <ColorMark color={props.color} />
      </Box>
      <span>{mistake.shortName}</span>
      <Box top={10} bottom={30}>
        <Title>{mistake.fullName}</Title>
      </Box>
      <ExamplesList examples={mistake.examples} />
      <Footer />
    </div>
  )
}
