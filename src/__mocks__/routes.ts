import { authEndpoint, apiEndpoint } from '../configs/app'

export const apiRoute = (path: string) =>{
  return apiEndpoint.trimEnd() + path
}

export const authRoute = (path: string) => {
  return authEndpoint.trimEnd() + path
}