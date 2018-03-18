export function isLocalLink(link: string) {
  return link.startsWith('/') && ! link.startsWith('//')
}

function createUrl(path: string) {
  const publicPath = process.env.PUBLIC_PATH

  return publicPath && isLocalLink(path)
    ? publicPath.replace(/\/$/, '') + path
    : path
}

export function mistakeLink(mistakeId: string) {
  return createUrl(`/mistake/${mistakeId}/`)
}

export function isMistakeLink(link: string) {
  return link.startsWith(createUrl('/mistake/'))
}

export function listLink() {
  return createUrl('/')
}
