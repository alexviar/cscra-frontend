import { LoginForm } from "../state";

const initialState: LoginForm = {
  fields: {
    username: "",
    password: ""
  },
  errors: {
    username: "",
    password: ""
  },
  message: ""
}
export default (state: LoginForm = initialState, action: any): LoginForm  => {
  if(action.type == "UPDATE_LOGIN_FORM"){
    return {
      ...state,
      ...action.payload
    }
  }
  if(action.type == "LOGIN"){
    return {
      ...state,
      message: "",
      errors: initialState.errors
    }
  }
  if(action.type == "LOGIN_COMPLETED" && action.error){
    const {message, errors} = action.payload
    return {
      ...state,
      message,
      errors: errors || initialState.errors
    }
  }
  if(action.type == "LOGIN_COMPLETED"){
    return initialState
  }
  return state
}