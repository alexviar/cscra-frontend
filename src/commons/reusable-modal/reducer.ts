type State = {
  show: boolean
  [key: string]: any
}

const modalReducer = (state: State, action: any): State =>{
  const { type, payload, meta } = action
  switch(type) {
    case "OPEN_MODAL":
      return {
        show: true,
        ...payload
      }
    case "CLOSE_MODAL":
      return {show: false}
    default:
      return state
  }
}

export const createModalReducer = (key: string) => {
  return (state: State = {show: false}, action: any) => {
    const { meta } = action
    return meta?.key === key ? modalReducer(state, action) : state
  }
}