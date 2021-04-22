import axios, { AxiosTransformer } from 'axios'
import {apiEndpoint} from '../../configs/app.json'
import Qs from 'qs'
import { keysToCamel } from '../utils'

export const apiClient = axios.create({
  "baseURL": apiEndpoint,
  "timeout": 30000,
  // transformRequest: [(data, headers)=>{
  //   console.log("TransformRequest", data)
  //   return data
  // }],
  transformResponse: [
    ...axios.defaults.transformResponse as AxiosTransformer[],
    (data)=>{
      const result = keysToCamel(data)
      console.log("TransformedResponse", result)
      return result
    }
  ]
})

apiClient.defaults.withCredentials = true

apiClient.interceptors.request.use(config => {
  config.headers.Accept = "application/json"
  config.paramsSerializer = params => {
    // Qs is not included in the Axios package
    return Qs.stringify(params, {
      arrayFormat: "brackets",
      encode: false
    });
  };
  console.log("Axios config", config)
  return config;
});

export default apiClient