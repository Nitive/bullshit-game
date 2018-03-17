export function getEnv<T extends string>(envName: string, check: (x: string) => x is T): T
export function getEnv(envName: string): string
export function getEnv<T extends string>(envName: string, check?: (x: string) => x is T) {
  const env = process.env[envName]

  if (!env) {
    throw new Error(`Need to specify ${envName} env`)
  }

  if (check && !check(env)) {
    throw new Error('env do not pass condition')
  }

  return env
}
