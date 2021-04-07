import { useQuery } from "react-query"
import apiClient from "../../../../commons/services/apiClient"

export const useFetchRoles = () => {
  return useQuery("fetchRoles", ()=>apiClient.get("/roles"))
}