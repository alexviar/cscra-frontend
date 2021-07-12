import { User } from '../../../../commons/auth'
import { Plan } from '../services'
import * as Permisos from './Permisos'

export const PlanPolicy = {
  verIndice(user: User) {
    return user.canAny([
      Permisos.VER_PLANES,
      Permisos.VER_PLANES_REGIONAL,
      Permisos.REGISTRAR_PLANES
    ])
  },
  ver(user: User) {
    return user.canAny([
      Permisos.VER_PLANES,
      Permisos.VER_PLANES_REGIONAL,
    ])
  },
  registrar(user: User) {
    return user.canAny([
      Permisos.REGISTRAR_PLANES
    ])
  },
  registrarAvance(user: User, plan: Plan) {
    return user.id == plan.usuarioId
  }
}