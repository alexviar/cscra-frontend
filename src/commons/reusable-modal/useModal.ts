import { useDispatch, useSelector } from "react-redux"

export const useModal = <Props = {[k: string]: any}>(key: string = "modal") => {
  const modalState = useSelector<{
    modals: {[k: string]: {
      show: boolean
    }}
  }>(state=>state.modals[key]) as {
    show: boolean
  } & Props

  const dispatch = useDispatch()

  return {
    ...modalState,
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