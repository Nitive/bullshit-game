import h from '@eff/dom/h'
import * as path from 'path'

interface Icon {
  src: string,
  sizes: string,
  type: string,
}

export interface Manifest {
  fileName: string,
  icons: Icon[],
  name: string,
  short_name: string,
  orientation: string,
  display: string,
  start_url: string,
  background_color: string,
  theme_color: string,
}

export function ManifestMeta({ publicPath, manifest }: { publicPath: string, manifest: Manifest }) {
  const icons = manifest.icons
    .map(icon => [
      h('link', { props: { rel: icon, sizes: icon.sizes, href: icon.src } }),
      h('link', { props: { rel: 'apple-touch-icon', sizes: icon.sizes, href: icon.src } }),
    ])
    .reduce((acc, mistakes) => [...acc, ...mistakes], [])

  return [
    h('link', { props: { rel: 'manifest', href: path.join(publicPath, manifest.fileName) } }),
    h('meta', { props: { name: 'mobile-web-app-capable', content: 'yes' } }),
    h('meta', { props: { name: 'apple-mobile-web-app-capable', content: 'yes' } }),
    h('meta', { props: { name: 'application-name', content: manifest.short_name } }),
    h('meta', { props: { name: 'apple-mobile-web-app-title', content: manifest.short_name } }),
    h('meta', { props: { name: 'theme-color', content: manifest.theme_color } }),
    h('meta', { props: { name: 'msapplication-navbutton-color', content: manifest.background_color } }),
    h('meta', { props: { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' } }),
    h('meta', { props: { name: 'msapplication-starturl', content: manifest.start_url } }),
    ...icons,
  ]
}
