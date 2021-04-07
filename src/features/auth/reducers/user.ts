import { User } from "../state"

export default (state: User|null={
  id: 0,
  username: "alexviar",
  active: true,
  createdAt: "",
  updatedAt: "",
  externalId: 0,
  roleIds: []
}, action: any): User|null => {
  const {type, payload, error} = action
  switch(type){
    case "SET_USER":
    case "LOGIN_COMPLETED":
    case "LOAD_USER_COMPLETED":
      return error ? state : payload
    case "UNAUTHORIZED":
      return null
    default:
      return state
  }
}