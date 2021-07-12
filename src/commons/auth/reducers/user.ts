import { User } from "../state"

export default (state: User|null=null, action: any): User|null => {
  const {type, payload, error} = action
  switch(type){
    case "SET_USER":
      console.log(action)
      return error ? state : payload
    case "UNAUTHORIZED":
      return null
    default:
      return state
  }
}