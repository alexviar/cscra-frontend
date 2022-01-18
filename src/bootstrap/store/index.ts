import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { createModalReducer } from "../../commons/reusable-modal"
import { sidebarVisibility } from "../../commons/components/layouts/reducer";

//@ts-ignore
const composeWithDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const configureStore = () => {
  const rootReducer = combineReducers({
    modals: combineReducers({
      queryLoader: createModalReducer("queryLoader"),
      dm11Viewer: createModalReducer("dm11Viewer"),
      pdfModal: createModalReducer("pdfModal")
    }),
    sidebarVisibility
  })
  // mount it on the Store
  const store = createStore(
    rootReducer
  )

  return store
}


export default configureStore