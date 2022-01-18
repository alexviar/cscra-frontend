import { User } from "../hooks"

/**
 * Si la politica pasada como argumento devuelve undefined entonces otorga permiso solo si el usuario es un super usuario,
 * caso contrario devuelve el resultado original de la politica
 */
export const superUserPolicyEnhancer = <F extends (user: User, context?: any) => boolean | undefined>(authorize: F): F => {
  return ((user, context) => {
    const granted = authorize(user, context)
    if(granted !== undefined) return granted
    if(user) return user.isSuperUser()
  }) as F
}