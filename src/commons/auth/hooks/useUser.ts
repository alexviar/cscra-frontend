import { AxiosResponse } from "axios"
import { useMemo } from "react"
import { useQuery } from "react-query"
import { User as TUser, AuthService } from "../services"

export const useUser = () => {

  const fetchUser = useQuery(["user"], ()=>{
    return AuthService.fetch()
  }, {
    // refetchOnMount: false,
    initialData: ()=>{
      let cache = localStorage.getItem("user")
      if(cache) return{status:200, statusText: "OK", headers: {}, config: {}, data: JSON.parse(cache)} as AxiosResponse<TUser>
    },
    onSuccess({data}){
      localStorage.setItem("user", JSON.stringify(data))
    }
  })
  
  // const user = fetchUser.isError ? null : fetchUser.data?.data
  const user = fetchUser.data?.data

  return useMemo(()=>{
    if(user !== null){
      const enhancedUser = {
        ...(user||{}),
        isReady: fetchUser.status === "success",
        isLoading: fetchUser.isFetching,
        error: fetchUser.error,
        can: function(permission: string | string[], allowSuperUser: boolean = false) {
          if(typeof permission === "string") permission = [permission]
          return permission.every(p => user?.roles.some(r => r.permissions.some(up => up.name == p))) || (allowSuperUser && this.isSuperUser())
        },
        canAny: function(permission: string[], allowSuperUser: boolean = false) {
          return permission.some(p => user?.roles.some(r => r.permissions.some(up => up.name == p))) || (allowSuperUser && this.isSuperUser())
        },
        hasRole: (role: number | string) => {
          return user?.roles.some(r=>r.name === role || r.id === role)
        },
        isSuperUser: function() {
          return this.hasRole(1)
        }
      }
      return enhancedUser;
    } 
    return null
  }, [user])
}

export type User = ReturnType<typeof useUser>