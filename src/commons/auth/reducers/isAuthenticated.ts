export default (state: boolean|null=null, action: any): boolean|null => {
  const {type, payload, error} = action
  switch(type){
    case "SET_USER":
      return !!payload
    case "UNAUTHORIZED":
      return false
    default:
      return state
  }
}