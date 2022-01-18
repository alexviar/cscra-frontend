import { authHandlers } from './authHandlers'
import { regionalHandlers } from './regionalHandlers'
import { listaMoraHandlers } from './listaMoraHandlers'
import { medicoHandlers } from './medicoHandlers'
import { proveedorHandlers } from './proveedorHandlers'
import { solicitudAtencionExternaHandlers } from './solicitudAtencionExternaHandlers'

export const handlers = [
  ...authHandlers,
  ...regionalHandlers,
  ...listaMoraHandlers,
  ...medicoHandlers,
  ...proveedorHandlers,
  ...solicitudAtencionExternaHandlers
]