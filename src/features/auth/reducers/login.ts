
type RequestState = {
  completed?: boolean,
}
export default (state: RequestState = {}, action: any)=>{
  const {type, payload} = action
  switch(type){
    case "LOGIN": 
      return {
        completed: false
      }
    case "LOGIN_COMPLETED":
      return {
        completed: true
      }
  }
  return state
}