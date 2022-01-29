import { User } from "../../../../commons/auth";
import * as Permisos from "./Permisos"

export class UsuarioPolicy {
  
  index = (user: User) => {
    return this.view(user) || this.register(user)
  }  

  view = (user: User, context?: {
    regionalId: number
  }) => { 
    const byRegionalOnly = this.viewByRegionalOnly(user, context)
    if(byRegionalOnly !== undefined) return byRegionalOnly
    if(user?.can(Permisos.VER_USUARIOS)) return true
  }

  viewByRegionalOnly = (user: User, context?: {
    regionalId: number
  }) => {
    if(user?.can(Permisos.VER_USUARIOS_MISMA_REGIONAL)) return !context?.regionalId || user.regionalId == context.regionalId
  }

  register = (user: User, context?: {
    regionalId: number
  }) => {
    const byRegionalOnly = this.registerByRegionalOnly(user, context)
    if(byRegionalOnly !== undefined) return byRegionalOnly
    if(user?.can(Permisos.REGISTRAR_USUARIOS)) return true
  }

  registerByRegionalOnly = (user: User, context?: {
    regionalId: number
  }) => {
    if(user?.can(Permisos.REGISTRAR_USUARIOS_MISMA_REGIONAL)) return !context?.regionalId || user.regionalId == context.regionalId
  }

  edit = (user: User, context?: {
    regionalId: number
  }) => {
    const byRegionalOnly = this.editByRegionalOnly(user, context)
    if(byRegionalOnly !== undefined) return byRegionalOnly
    if(user?.can(Permisos.ACTUALIZAR_USUARIOS)) return true
  }

  editByRegionalOnly = (user: User, context?: {
    regionalId: number
  }) => {
    if(user?.can(Permisos.ACTUALIZAR_USUARIOS_MISMA_REGIONAL)) return !context?.regionalId || user.regionalId == context.regionalId
  }

  changePassword = (user: User, context?: {
    regionalId: number
  }) => {
    const byRegionalOnly = this.changePasswordByRegionalOnly(user, context)
    if(byRegionalOnly !== undefined) return byRegionalOnly
    if(user?.can(Permisos.CAMBIAR_CONTRASEÑAS)) return true
  }

  changePasswordByRegionalOnly = (user: User, context?: {
    regionalId: number
  }) => {
    if(user?.can(Permisos.CAMBIAR_CONTRASEÑAS_MISMA_REGIONAL)) return !context?.regionalId || user.regionalId == context.regionalId
  }

  disable = (user: User, context?: {
    regionalId: number
  }) => {
    const byRegionalOnly = this.enableByRegionalOnly(user, context)
    if(byRegionalOnly !== undefined) return byRegionalOnly
    if(user?.can(Permisos.BLOQUEAR_USUARIOS)) return true
  }

  disableByRegionalOnly = (user: User, context?: {
    regionalId: number
  }) => {
    if(user?.can(Permisos.BLOQUEAR_USUARIOS_MISMA_REGIONAL)) return !context?.regionalId || user.regionalId == context.regionalId
  }

  enable = (user: User, context?: {
    regionalId: number
  }) => {
    const byRegionalOnly = this.enableByRegionalOnly(user, context)
    if(byRegionalOnly !== undefined) return byRegionalOnly
    if(user?.can(Permisos.DESBLOQUEAR_USUARIOS)) return true
  }

  enableByRegionalOnly = (user: User, context?: {
    regionalId: number
  }) => {
    if(user?.can(Permisos.DESBLOQUEAR_USUARIOS_MISMA_REGIONAL)) return !context?.regionalId || user.regionalId == context.regionalId
  }
}