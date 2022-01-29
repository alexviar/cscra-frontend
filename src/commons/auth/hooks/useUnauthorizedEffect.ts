import { useEffect, useRef } from "react"
import { useQueryClient } from "react-query"
import { apiClient } from "../../services"

export const useUnauthorizedEffect = ()=>{
  
  const queryClient = useQueryClient()

  const isMountedRef = useRef(false);

  if(!isMountedRef.current) {
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
  }

  useEffect(()=>{
    isMountedRef.current = true
  }, [])
}