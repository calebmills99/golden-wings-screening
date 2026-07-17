export interface Auth0Config {
  domain: string
  clientId: string
  audience: string
}

export const auth0Config: Auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || '',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || '',
  audience: import.meta.env.VITE_AUTH0_AUDIENCE || ''
}

export const futureProtectedRoutes = [
  '/login',
  '/account',
  '/library',
  '/download'
] as const

export function isAuth0Ready(config: Auth0Config = auth0Config): boolean {
  return Boolean(config.domain && config.clientId)
}
