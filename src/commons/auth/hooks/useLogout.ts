import { useQueryClient, useMutation } from "react-query"
import { AuthService } from "../services"

export const useLogout = ()=>{
  const queryClient = useQueryClient()

  return useMutation(()=>AuthService.logout(), {
    onSuccess: () => {
      queryClient.clear()
      localStorage.removeItem("user")
      queryClient.setQueryData(["user"], {
        data: null
      })
    }
  })
}