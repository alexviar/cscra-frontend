import { useMemo } from "react"
import { useSelector } from "react-redux"
import { getUser } from "../selectors/inputSelectors"
import { User } from "../state"

export const useLoggedUser = () => {
  const user = useSelector(getUser) as User

  const loggedUser = useMemo(()=>{
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
  }, [user])

  return loggedUser
}