import { call, put, takeLatest } from "redux-saga/effects";
import apiClient from "../../../commons/services/apiClient";
import { User } from "../../auth/state";

const REGISTER_USER = "REGISTER_USER"
export function registerUser(credentials: {username: string, password: string, externalId: number}) {
  return {
    type: REGISTER_USER,
    payload: credentials
  }
}

export function registerUserComplete(response: User | Error) {
  return {
    type: REGISTER_USER,
    payload: response,
    error: response instanceof Error
  }
}

function* handleRegisterUser({payload}: ReturnType<typeof registerUser>){
  try{
    //@ts-ignore
    const response = yield call(apiClient.post, '/users', payload)
    yield put(registerUserComplete(response))
  }
  catch(e){
  }
}

export default function* watchRegisterUser(){
  yield takeLatest('REGISTER_USER', handleRegisterUser)
}
