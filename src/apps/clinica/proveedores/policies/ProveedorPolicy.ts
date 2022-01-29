import { User } from "../../../../commons/auth";
import * as Permisos from "./Permisos"

export class ProveedorPolicy {
  
  index = (user: User) => {
    return this.view(user) || this.register(user)
  }  

  view = (user: User, context?: {
    regionalId: number
  }) => { 
    const byRegionalOnly = this.viewByRegionalOnly(user, context)
    if(byRegionalOnly !== undefined) return byRegionalOnly
    if(user?.can(Permisos.VER_PROVEEDORES)) return true
  }

  viewByRegionalOnly = (user: User, context?: {
    regionalId: number
  }) => {
    if(user?.can(Permisos.VER_PROVEEDORES_REGIONAL)) return !context?.regionalId || user.regionalId == context.regionalId
  }

  register = (user: User, context?: {
    regionalId: number
  }) => {
    const byRegionalOnly = this.registerByRegionalOnly(user, context)
    if(byRegionalOnly !== undefined) return byRegionalOnly
    if(user?.can(Permisos.REGISTRAR_PROVEEDORES)) return true
  }

  registerByRegionalOnly = (user: User, context?: {
    regionalId: number
  }) => {
    if(user?.can(Permisos.REGISTRAR_PROVEEDORES_REGIONAL)) return !context?.regionalId || user.regionalId == context.regionalId
  }

  edit = (user: User, context?: {
    regionalId: number
  }) => {
    const byRegionalOnly = this.editByRegionalOnly(user, context)
    if(byRegionalOnly !== undefined) return byRegionalOnly
    if(user?.can(Permisos.ACTUALIZAR_PROVEEDORES)) return true
  }

  editByRegionalOnly = (user: User, context?: {
    regionalId: number
  }) => {
    if(user?.can(Permisos.ACTUALIZAR_PROVEEDORES_REGIONAL)) return !context?.regionalId || user.regionalId == context.regionalId
  }

  updateStatus = (user: User, context?: {
    regionalId: number
  }) => {
    const byRegionalOnly = this.updateStatusByRegionalOnly(user, context)
    if(byRegionalOnly !== undefined) return byRegionalOnly
    if(user?.can(Permisos.ACTUALIZAR_ESTADO_PROVEEDORES)) return true
  }

  updateStatusByRegionalOnly = (user: User, context?: {
    regionalId: number
  }) => {
    if(user?.can(Permisos.ACTUALIZAR_ESTADO_PROVEEDORES_REGIONAL)) return !context?.regionalId || user.regionalId == context.regionalId
  }
}