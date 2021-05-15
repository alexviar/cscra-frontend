import { takeLatest } from "@redux-saga/core/effects"

const UNAUTHORIZED = "UNAUTHORIZED"

export function unauthorized(){
  return {
    type: UNAUTHORIZED
  }
}

function* handleUnauthorized(action: ReturnType<typeof unauthorized>){
  localStorage.removeItem("user")
}

export function* watchUnauthorized(){
  yield takeLatest(UNAUTHORIZED, handleUnauthorized)
}