import { AxiosError } from "axios"
import { useMemo } from "react"
import { useQuery } from "react-query"
import { AuthService } from "../services"

export const useUser = () => {
  const fetchUser = useQuery(["user"], ()=>{
    return AuthService.fetch()
  }, {
    staleTime: Infinity,
    refetchOnMount: false
  })
  
  // const user = fetchUser.isError ? null : fetchUser.data?.data
  const user = fetchUser.data?.data

  return useMemo(()=>{
    if(user !== undefined){
      if(user){
        const enhancedUser = {
          ...user,
          can: function(permission: string | string[], allowSuperUser: boolean = false) {
            if(typeof permission === "string") permission = [permission]
            return permission.every(p => user?.roles.some(r => r.permissions.some(up => up.name == p))) || (allowSuperUser && this.isSuperUser())
          },
          canAny: function(permission: string[], allowSuperUser: boolean = false) {
            return permission.some(p => user?.roles.some(r => r.permissions.some(up => up.name == p))) || (allowSuperUser && this.isSuperUser())
          },
          hasRole: (role: string) => {
            return user?.roles.some(r=>r.name==role)
          },
          isSuperUser: function() {
            return this.hasRole("super user")
          }
        }
        return enhancedUser;
      } 
      return null
    }
  }, [user])
}

export type User = ReturnType<typeof useUser>