export function getEnv(envName: string): string {
  const env = process.env[envName]

  if (!env) {
    throw new Error(`Need to specify ${envName} env`)
  }

  return env
}
