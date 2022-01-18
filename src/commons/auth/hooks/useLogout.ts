import { useQueryClient, useMutation } from "react-query"
import { AuthService } from "../services"

export const useLogout = ()=>{
  const queryClient = useQueryClient()

  return useMutation(()=>AuthService.logout(), {
    onSuccess: () => {
      queryClient.clear()
      queryClient.setQueryData(["user"], {
        data: null
      })
    }
  })
}