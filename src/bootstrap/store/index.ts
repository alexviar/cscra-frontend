import { all } from "@redux-saga/core/effects";
import createSagaMiddleware from "redux-saga"
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { watchUnauthorized } from "../../features/auth/actions";
import auth from "../../features/auth/reducers";
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