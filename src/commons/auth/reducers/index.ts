import { combineReducers } from 'redux'
import user from './user'
import isAuthenticated from './isAuthenticated'

export const AuthModuleReducer = combineReducers({
  user,
  isAuthenticated
})

export type AuthModuleState = ReturnType<typeof AuthModuleReducer>

export default AuthModuleReducer