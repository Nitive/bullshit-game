export function getManifestNameFromStats(stats: any): string {
  const assets: Array<{ name: string }> = (stats.assets)

  const manifest = assets
    .map(asset => asset.name)
    .find(asset => asset.startsWith('manifest.'))

  if (!manifest) {
    throw new Error(`Could not find manifest file: ${manifest}`)
  }

  return manifest
}
