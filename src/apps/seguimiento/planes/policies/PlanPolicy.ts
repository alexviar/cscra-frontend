import { User } from '../../../../commons/auth'
import * as Permisos from './Permisos'

export const PlanPolicy = {
  verIndice(user: User) {
    return user.canAny([
      Permisos.VER_PLANES,
      Permisos.VER_PLANES_REGIONAL,
      Permisos.REGISTRAR_PLANES,
      Permisos.REGISTRAR_PLANES_REGIONAL
    ])
  },
  ver(user: User) {
    Permisos.VER_PLANES,
    Permisos.VER_PLANES_REGIONAL
  },
  registrar(user: User) {
    return user.canAny([
      Permisos.REGISTRAR_PLANES,
      Permisos.REGISTRAR_PLANES_REGIONAL
    ])
  },
  registrarAvance(user: User) {
    return user.canAny([
      Permisos.REGISTRAR_AVANCE
    ])
  }
}