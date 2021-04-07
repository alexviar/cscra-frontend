export default (state: {completed?:boolean} = {}, action: any)=>{
  const {payload, type} = action
  switch(type){
    case "LOAD_USER":
      return {completed: false}
    case "LOAD_USER_COMPLETED":
      return {completed: true}
  }
  return state
}