import { User } from "../../../../commons/auth";
import * as Permisos from "./Permisos"

export class SolicitudAtencionExternaPolicy {
  
  index = (user: User) => {
    return this.view(user) || this.register(user)
  }

  register = (user: User, context?: {
    regionalId: number
  }) => {
    const byRegionalOnly = this.registerByRegionalOnly(user, context)
    if(byRegionalOnly !== undefined) return byRegionalOnly
    if(user?.can(Permisos.REGISTRAR_SOLICITUDES_DE_ATENCION_EXTERNA)) return true
  }

  registerByRegionalOnly = (user: User, context?: {
    regionalId: number
  }) => {
    if(user?.can(Permisos.REGISTRAR_SOLICITUDES_DE_ATENCION_EXTERNA_MISMA_REGIONAL)) return !context?.regionalId || user.regionalId == context.regionalId
  }

  view = (user: User, context?: {
    regionalId: number
  }) => {
    // const restrictions = [this.viewByRegionalOnly(user, context)]
    // let hasRestrictions;
    // for(let restriction of restrictions){
    //   if(restriction === false) return false
    //   hasRestrictions ||= restriction
    // }
    // if(hasRestrictions) return true    
    const byRegionalOnly = this.viewByRegionalOnly(user, context)
    if(byRegionalOnly !== undefined) return byRegionalOnly
    if(user?.can(Permisos.VER_SOLICITUDES_DE_ATENCION_EXTERNA)) return true
  }

  viewByRegionalOnly = (user: User, context?: {
    regionalId: number
  }) => {
    if(user?.can(Permisos.VER_SOLICITUDES_DE_ATENCION_EXTERNA_MISMA_REGIONAL)) return !context?.regionalId || user.regionalId == context.regionalId
  }

  emit = (user: User, context?: {
    regionalId: number
  }) => {
    const byRegionalOnly = this.emitByRegionalOnly(user, context)
    if(byRegionalOnly !== undefined) return byRegionalOnly
    if(user?.can(Permisos.EMITIR_SOLICITUDES_DE_ATENCION_EXTERNA)) return true
  }

  emitByRegionalOnly = (user: User, context?: {
    regionalId: number
  }) => {
    if(user?.can(Permisos.EMITIR_SOLICITUDES_DE_ATENCION_EXTERNA_MISMA_REGIONAL)) return !context?.regionalId || user.regionalId == context.regionalId
  }
}