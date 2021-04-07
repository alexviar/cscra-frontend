import { combineReducers } from "redux"

export function showSidebar(state=true, action: any){
  if(action.type == "TOGGLE_SIDEBAR"){
    return !state
  }
  return state
}

export default combineReducers({
  showSidebar
})