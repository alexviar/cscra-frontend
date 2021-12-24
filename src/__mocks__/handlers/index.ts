import { authHandlers } from './authHandlers'
import { regionalHandlers } from './regionalHandlers'

export const handlers = [
  ...authHandlers,
  ...regionalHandlers
]