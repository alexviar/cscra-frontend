import React, {useEffect} from "react"
import { Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux"
import { Redirect, useLocation } from "react-router"
import apiClient from "../../../commons/services/apiClient"
import { getLoginForm, getLoginState, getIsAuthenticated } from "../selectors/inputSelectors"
import "./auth.css"

export const Login = () => {
  const dispatch = useDispatch()
  const {state} = useLocation<{from: string}>()
  const isAuthenticated = useSelector(getIsAuthenticated)
  const {fields, message, errors} = useSelector(getLoginForm)
  const {completed: loginCompleted} = useSelector(getLoginState)

  return isAuthenticated ? 
    <Redirect to={state?.from || "/"} /> :
    <div className="auth-wrapper bg-light">
      <div className="auth-inner shadow-sm">
        <Form onSubmit={(e)=>{
          e.preventDefault()
          dispatch({
            type: "LOGIN",
          })
          apiClient.get('/sanctum/csrf-cookie').then(response => {
            apiClient.post('/login', {
                username: fields.username,
                password: fields.password
            }).then(({data, status}) => {
              localStorage.setItem("user", JSON.stringify(data))
              dispatch({
                type: "LOGIN_COMPLETED",
                payload: data,
                error: false
              })
            }, (error)=>{
              dispatch({
                type: "LOGIN_COMPLETED",
                payload: error.response.data,
                error: true
              })
            })
          });
        }}>
          <h3 className="mb-2 text-center" style={{ fontSize: "1.25rem" }}>Iniciar Sesión en Hipócrates</h3>
          {message ? <Alert variant="danger" >{message}</Alert> :  null}
          <Form.Group>
            <Form.Label>Usuario</Form.Label>
            <Form.Control type="text" value={fields.username}
              isInvalid={!!errors.username}
              onChange={(e)=>{
                const value = e.target.value
                dispatch({
                  type: "UPDATE_LOGIN_FORM",
                  payload: {
                    fields: {
                      ...fields,
                      username: value
                    },
                    errors: {
                      ...errors,
                      username: ""
                    }
                  }
                })
              }}
            />
            <Form.Text className="text-danger" >{errors.username}</Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" value={fields.password}
              isInvalid={!!errors.password}
              onChange={(e)=>{
                const value = e.target.value
                dispatch({
                  type: "UPDATE_LOGIN_FORM",
                  payload: {
                    fields: {
                      ...fields,
                      password: value
                    },
                    errors: {
                      ...errors,
                      password: ""
                    }
                  }
                })
              }}
            />
            <Form.Text className="text-danger" >{errors.password}</Form.Text>
          </Form.Group>

          {/* <div className="form-group">
        <div className="custom-control custom-checkbox">
          <input type="checkbox" className="custom-control-input" id="customCheck1" />
          <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
        </div>
      </div> */}

          <Button type="submit" className="btn btn-primary btn-block">
            {loginCompleted === false ? <Spinner size="sm" animation="border" /> : null}
            <span className="align-middle ml-1">Iniciar Sesión</span>
            </Button>
          {/* <p className="forgot-password text-right">
        ¿Olvidó su <a href="#">contraseña?</a>
      </p> */}
        </Form>
      </div>
    </div>
}

export default Login