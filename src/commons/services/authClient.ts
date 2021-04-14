import axios from 'axios'
import {authEndpoint} from '../../configs/app.json'
import Qs from 'qs'
import { keysToCamel } from '../utils'

export const authClient = axios.create({
  "baseURL": authEndpoint,
  "timeout": 30000,
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

authClient.defaults.withCredentials = true

authClient.interceptors.request.use(config => {
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