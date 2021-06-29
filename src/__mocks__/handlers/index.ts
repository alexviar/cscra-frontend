import { authHandlers } from './authHandlers'
import { planHandlers } from './planHandlers'
import { areaHandlers } from './areaHandlers'
import { regionalHandlers } from './regionalHandlers'

export const handlers = [
  ...authHandlers,
  ...planHandlers,
  ...areaHandlers,
  ...regionalHandlers
]