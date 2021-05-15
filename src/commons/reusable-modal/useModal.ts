import { useDispatch } from "react-redux"

export const useModal = <Props = any>(key: string = "modal") => {
  const dispatch = useDispatch()
  return {
    open: (payload: Props)=>{
      dispatch({
        type: "OPEN_MODAL",
        payload,
        meta: { key }
      })
    },
    close: () => {
      dispatch({
        type: "CLOSE_MODAL",
        meta: { key }
      })
    }
  }
}