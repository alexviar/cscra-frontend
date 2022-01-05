import axios, { AxiosResponseTransformer }  from 'axios'
import {authEndpoint} from '../../configs/app'
import Qs from 'qs'
import { keysToCamel } from '../utils'

export const authClient = axios.create({
  "baseURL": authEndpoint,
  "timeout": 30000,
  transformResponse: [
    ...axios.defaults.transformResponse as AxiosResponseTransformer[],
    (data)=>{
      const result = keysToCamel(data)
      // console.log("TransformedResponse", result)
      return result
    }
  ]
})

authClient.defaults.withCredentials = true

authClient.interceptors.request.use(config => {
  if(!config.headers){
    config.headers = {}
  }
  config.headers.Accept = "application/json"
  config.paramsSerializer = params => {
    // Qs is not included in the Axios package
    return Qs.stringify(params, {
      arrayFormat: "brackets",
      encode: false
    });
  };
  return config;
});

export default authClient