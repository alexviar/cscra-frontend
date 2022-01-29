import { User } from "../../../../commons/auth";
import * as Permisos from "./Permisos"

export class ListaMoraPolicy {
  
  index = (user: User) => {
    return this.view(user) || this.register(user)
  }  

  view = (user: User, context?: {
    regionalId: number
  }) => {
    const byRegionalOnly = this.viewByRegionalOnly(user, context)
    if(byRegionalOnly !== undefined) return byRegionalOnly
    if(user?.can(Permisos.VER_LISTA_DE_MORA)) return true
  }

  viewByRegionalOnly = (user: User, context?: {
    regionalId: number
  }) => {
    if(user?.can(Permisos.VER_LISTA_DE_MORA_REGIONAL)) return !context?.regionalId || user.regionalId == context.regionalId
  }

  register = (user: User, context?: {
    regionalId: number
  }) => {
    const byRegionalOnly = this.registerByRegionalOnly(user, context)
    if(byRegionalOnly !== undefined) return byRegionalOnly
    if(user?.can(Permisos.AGREGAR_A_LA_LISTA_DE_MORA)) return true
  }

  registerByRegionalOnly = (user: User, context?: {
    regionalId: number
  }) => {
    if(user?.can(Permisos.AGREGAR_A_LA_LISTA_DE_MORA_MISMA_REGIONAL)) return !context?.regionalId || user.regionalId == context.regionalId
  }

  remove = (user: User, context?: {
    regionalId: number
  }) => {
    const byRegionalOnly = this.removeByRegionalOnly(user, context)
    if(byRegionalOnly !== undefined) return byRegionalOnly
    if(user?.can(Permisos.QUITAR_DE_LA_LISTA_DE_MORA)) return true
  }

  removeByRegionalOnly = (user: User, context?: {
    regionalId: number
  }) => {
    if(user?.can(Permisos.QUITAR_DE_LA_LISTA_DE_MORA_MISMA_REGIONAL)) return !context?.regionalId || user.regionalId == context.regionalId
  }
}