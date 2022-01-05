import { useMemo } from "react"
import { useQuery } from "react-query"
import { useSelector } from "react-redux"
import { getUser, getIsAuthenticated } from "../selectors/inputSelectors"
import { AuthService } from "../services"
import { User as TUser } from "../state"

export const useUser = () => {
  const fetchUser = useQuery(["user"], ()=>{
    return AuthService.fetch()
  }, {
    keepPreviousData: true
  })

  const user = fetchUser.data?.data

  return useMemo(()=>{
    if(user){
      return user ? {
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
      } : null
    }
  }, [user])
}

export type User = ReturnType<typeof useUser>