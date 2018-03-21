import * as express from 'express'
import * as webpack from 'webpack'
import * as devMiddleware from 'webpack-dev-middleware'
import * as hotMiddleware from 'webpack-hot-middleware'
import webpackConfig from './webpack.client'
import { renderPage } from '../prerender/render'
import { getEnv } from 'utils/get-env'
import { getAssetsFromStats } from '../prerender/assets-from-stats'

const app = express()

webpackConfig.entry.main.unshift('webpack-hot-middleware/client?reload=true')

const compiler = webpack(webpackConfig)

app.use(devMiddleware(compiler, { publicPath: getEnv('ASSETS_PATH'), serverSideRender: true }))
app.use(hotMiddleware(compiler))

app.get('/favicon.ico', (_req, res) => {
  res.status(404).send('Icon not specified')
})

app.get('/*', (req, res) => {
  const stats = res.locals.webpackStats.toJson()

  renderPage(req.originalUrl, getAssetsFromStats(stats))
    .addListener({
      next(html) {
        res.send(html)
      },
    })
})

app.listen(process.env.PORT || 5000, (err?: Error) => {
  /* eslint-disable no-console */
  if (err) {
    console.error(err)
    return
  }
  console.log('Assets server is started')
  /* eslint-enable no-console */
})
