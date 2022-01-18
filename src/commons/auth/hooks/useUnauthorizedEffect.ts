import { useEffect } from "react"
import { useQueryClient } from "react-query"
import { apiClient } from "../../services"

export const useUnauthorizedEffect = ()=>{
  
  const queryClient = useQueryClient()

  useEffect(()=>{
    apiClient.interceptors.response.use(
      response=>response,
      error => {
        if(error.response?.status == 401 || error.response?.status == 419){
          queryClient.setQueryData(["user"], {
            data: null
          })
        }
        return Promise.reject(error);
      }
    )
  }, [])
}