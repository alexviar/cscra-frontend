import { all } from "@redux-saga/core/effects";
import createSagaMiddleware from "redux-saga"
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { watchUnauthorized } from "../../commons/auth/actions";
import auth from "../../commons/auth/reducers";
import { createModalReducer } from "../../commons/reusable-modal"
import main from "../reducers";

function* rootSaga() {
  yield all([
    watchUnauthorized()
  ])
}


//@ts-ignore
const composeWithDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const configureStore = () => {
  const rootReducer = combineReducers({
    modals: combineReducers({
      queryLoader: createModalReducer("queryLoader"),
      dm11Viewer: createModalReducer("dm11Viewer")
    }),
    main,
    auth
  })

  // create the saga middleware
  const sagaMiddleware = createSagaMiddleware()
  // mount it on the Store
  const store = createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(sagaMiddleware)
    )
  )

  // then run the saga
  sagaMiddleware.run(rootSaga)

  return store
}


export default configureStore