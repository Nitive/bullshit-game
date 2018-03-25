import * as path from 'path'
import * as express from 'express'
import * as webpack from 'webpack'
import * as devMiddleware from 'webpack-dev-middleware'
import * as hotMiddleware from 'webpack-hot-middleware'
import xs from 'xstream'
import webpackConfig from './webpack.client'
import { renderPage } from 'prerender/render'
import { getEnv } from 'utils/get-env'
import { getAssetsFromStats } from 'prerender/assets-from-stats'
import { getManifestNameFromStats } from 'prerender/get-manifest-from-stats'
import axios from 'axios'
import { Manifest } from 'prerender/manifest-meta'

const port = Number(process.env.PORT) || 5000
const assetsPath = getEnv('ASSETS_PATH')

const app = express()

webpackConfig.entry.main.unshift('webpack-hot-middleware/client?reload=true')

const compiler = webpack(webpackConfig)

app.use(devMiddleware(compiler, {
  publicPath: assetsPath,
  serverSideRender: true,
}))
app.use(hotMiddleware(compiler))

app.get('/favicon.ico', (_req, res) => {
  res.status(404).send('Icon not specified')
})

app.get('/*', (req, res) => {
  const stats = res.locals.webpackStats.toJson()
  const assets = getAssetsFromStats(stats)
  const manifestName = getManifestNameFromStats(stats)
  const manifestUrl = path.join(assetsPath, manifestName)

  const manifestP = axios
    .get(manifestUrl, { proxy: { host: 'localhost', port } })
    .then((res): Manifest => ({
      ...res.data,
      fileName: manifestName,
    }))

  xs.fromPromise(manifestP)
    .map(manifest => renderPage(req.originalUrl, assets, manifest))
    .flatten()
    .addListener({
      next(html: string) {
        res.send(html)
      },
      error(err) {
        res.send(err.toString())
        console.error(err)
      },
    })
})

app.listen(port, (err?: Error) => {
  /* eslint-disable no-console */
  if (err) {
    console.error(err)
    return
  }
  console.log(`Assets server is started: http://localhost:${port}/`)
  /* eslint-enable no-console */
})
