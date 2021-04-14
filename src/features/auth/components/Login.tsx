import React, {useEffect} from "react"
import { Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useForm } from "react-hook-form"
import { useMutation } from "react-query"
import { useDispatch, useSelector } from "react-redux"
import { Redirect, useLocation } from "react-router"
import {authClient} from "../../../commons/services"
import { getIsAuthenticated } from "../selectors/inputSelectors"
import { AuthService } from "../services/AuthService"
import * as rules from "../../../commons/components/rules"
import "./auth.css"

type Credentials = {
  username: string,
  password: string
}

type Inputs = Credentials & {
  remember_me: boolean
}

export const Login = () => {
  const dispatch = useDispatch()
  const {state} = useLocation<{from: string}>()
  const isAuthenticated = useSelector(getIsAuthenticated)

  const {handleSubmit, register, formState} = useForm<Inputs>({
    defaultValues: {
      username:"",
      password: "",
      remember_me: false
    }
  })

  const login = useMutation(({username, password, remember_me}: Inputs)=>{
    return AuthService.login(username, password, remember_me)
  }, {
    onSuccess: ({data}) => {
      localStorage.setItem("user", JSON.stringify(data))
      dispatch({
        type: "SET_USER",
        payload: data
      })
    }
  })

  return isAuthenticated ? 
    <Redirect to={state?.from || "/"} /> :
    <div className="auth-wrapper bg-light">
      <div className="auth-inner shadow-sm">
        <Form onSubmit={handleSubmit((credentials)=>{
            login.mutate(credentials)
          })}
        >
          <h3 className="mb-2 text-center" style={{ fontSize: "1.25rem" }}>Iniciar Sesión en Hipócrates</h3>
          {login.isError ? <Alert variant="danger" >{login.error?.response?.message || login.error?.message}</Alert> :  null}
          <Form.Group>
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              isInvalid={!!formState.errors.username}
              {...register("username", {
                required: rules.required()
              })}
            />
            <Form.Control.Feedback type="invalid" >{formState.errors.username?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password"
              isInvalid={!!formState.errors.password}              
              {...register("password", {
                required: rules.required()
              })}
            />
            <Form.Control.Feedback type="invalid" >{formState.errors.password?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Check
              type={"checkbox"}
              label="Recordar sesión"
              {...register("remember_me")}
            />
          </Form.Group>

          <Button type="submit" className="btn btn-primary btn-block">
            {login.isLoading ? <Spinner size="sm" animation="border" /> : null}
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