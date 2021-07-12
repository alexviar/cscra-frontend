import { useMemo } from "react"
import { useSelector } from "react-redux"
import { getUser, getIsAuthenticated } from "../selectors/inputSelectors"
import { User as TUser } from "../state"

export const useLoggedUser = () => {
  const user = useSelector(getUser) as TUser | null
  const isAuthenticated = useSelector(getIsAuthenticated) as TUser | null

  const loggedUser = useMemo(()=>{
    if(isAuthenticated !== null){
      return user && {
        ...user,
        can: function(permission: string | string[], allowSuperUser: boolean = true) {
          if(typeof permission === "string") permission = [permission]
          return permission.every(p => user?.allPermissions.some(up => up.name == p)) || (allowSuperUser && this.isSuperUser())
        },
        canAny: function(permission: string[], allowSuperUser: boolean = true) {
          return permission.some(p => user?.allPermissions.some(up => up.name == p)) || (allowSuperUser && this.isSuperUser())
        },
        hasRole: (role: string) => {
          return user?.roles.some(r=>r.name==role)
        },
        isSuperUser: function() {
          return this.hasRole("super user")
        }
      }
    }
  }, [user, isAuthenticated])

  return loggedUser
}

export type User = ReturnType<typeof useLoggedUser>