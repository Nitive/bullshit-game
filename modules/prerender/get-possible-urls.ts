import { IAppData } from 'data'

export function getPossibleUrls(appData: IAppData): string[] {
  const mistakesUrls = appData.mistakesGroups
    .map(group => group.mistakes)
    .reduce((acc, mistakes) => [...acc, ...mistakes], [])
    .map(mistake => `/mistake/${mistake.id}/`)

  return [
    '/',
    ...mistakesUrls,
  ]
}
