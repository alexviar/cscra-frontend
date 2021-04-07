import axios from 'axios'
import {baseUrl} from '../../configs/app.json'
import Qs from 'qs'
import { keysToCamel } from '../utils'

const apiClient = axios.create({
  "baseURL": baseUrl,
  "timeout": 30000,
  // transformRequest: [(data, headers)=>{
  //   console.log("TransformRequest", data)
  //   return data
  // }],
  transformResponse: [(data)=>{
    try{
      const result = keysToCamel(JSON.parse(data))
      console.log("TransformedResponse", result)
      return result
    }
    catch(e){
      console.error("OnTransformResponse", data, e)
    }
    return data
  }]
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