import { combineReducers } from 'redux'
import user from './user'
import loadUser from './loadUser'
import login from './login'
import loginForm from './loginForm'

export const AuthModuleReducer = combineReducers({
  user,
  loadUser,
  login,
  loginForm
})

export type AuthModuleState = ReturnType<typeof AuthModuleReducer>

export default AuthModuleReducer