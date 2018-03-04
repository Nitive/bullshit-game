import * as Snabbdom from 'snabbdom-pragma'
import { IMistakesGroup } from 'data'
import { Title } from '../ui/title'
import { Page } from '../ui/page'
import { Footer } from '../components/footer'
import { MistakesGroupsList } from '../components/mistakes-list'
import { Box } from '../ui/box'


export function MistakesListPage(props: { mistakesGroups: IMistakesGroup[] }) {
  return (
    <Page>
      <main>
        <Title>Ошибки в аргументации</Title>
        <Box top={30}>
          <MistakesGroupsList mistakesGroups={props.mistakesGroups} />
        </Box>
      </main>
      <Footer />
    </Page>
  )
}
