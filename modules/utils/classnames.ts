export function cx(...classNames: Array<string | null | undefined | 0>): string {
  return classNames.filter(Boolean).join(' ')
}
