
export function sidebarVisibility(state=true, action: any){
  if(action.type == "TOGGLE_SIDEBAR"){
    return !state
  }
  if(action.type == "CLOSE_SIDEBAR"){
    return false
  }
  return state
}