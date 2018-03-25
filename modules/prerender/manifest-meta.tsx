import * as Snabbdom from 'snabbdom-pragma'
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
      <link rel="icon" sizes={icon.sizes} href={icon.src} />,
      <link rel="apple-touch-icon" sizes={icon.sizes} href={icon.src} />,
    ])
    .reduce((acc, mistakes) => [...acc, ...mistakes], [])

  return [
    <link rel="manifest" href={path.join(publicPath, manifest.fileName)} />,
    <meta name="mobile-web-app-capable" content="yes" />,
    <meta name="apple-mobile-web-app-capable" content="yes" />,
    <meta name="application-name" content={manifest.short_name} />,
    <meta name="apple-mobile-web-app-title" content={manifest.short_name} />,
    <meta name="theme-color" content={manifest.theme_color} />,
    <meta name="msapplication-navbutton-color" content={manifest.background_color} />,
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />,
    <meta name="msapplication-starturl" content={manifest.start_url} />,
    ...icons,
  ]
}
