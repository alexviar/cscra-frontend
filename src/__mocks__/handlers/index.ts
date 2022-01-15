import { authHandlers } from './authHandlers'
import { regionalHandlers } from './regionalHandlers'
import { listaMoraHandlers } from './listaMoraHandlers'

export const handlers = [
  ...authHandlers,
  ...regionalHandlers,
  ...listaMoraHandlers
]