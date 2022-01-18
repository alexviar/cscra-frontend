import { useQueryClient, useMutation } from "react-query"
import { AuthService } from "../services/AuthService"

export const useLogin = () => {
  const queryClient = useQueryClient()
  const login = useMutation(({username, password, remember_me}: { username: string, password: string, remember_me: boolean})=>{
    return AuthService.login(username, password, remember_me)
  }, {
    onSuccess: ({data}) => {
      queryClient.setQueryData(["user"], {
        data
      })
    }
  })
  return login
}