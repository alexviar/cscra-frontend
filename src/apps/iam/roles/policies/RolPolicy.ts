import { User } from "../../../../commons/auth";
import * as Permisos from "./Permisos"

export class RolPolicy {
  
  index = (user: User) => {
    return this.view(user) || this.register(user)
  }  

  view = (user: User, context?: never) => { 
    if(user?.can(Permisos.VER_ROLES)) return true
  }

  register = (user: User, context?: never) => {
    if(user?.can(Permisos.REGISTRAR_ROLES)) return true
  }

  edit = (user: User, context?: never) => {
    if(user?.can(Permisos.ACTUALIZAR_ROLES)) return true
  }

  delete = (user: User, context?: never) => {
    if(user?.can(Permisos.ELIMINAR_ROLES)) return true
  }
}