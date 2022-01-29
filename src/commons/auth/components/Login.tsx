import { Form, Button, Alert, Image, Spinner } from 'react-bootstrap'
import { useForm } from "react-hook-form"
import { Redirect, useLocation } from "react-router"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { useUser, useLogin } from "../hooks"
import "./auth.css"

type Credentials = {
  username: string,
  password: string
}

type Inputs = Credentials & {
  remember_me: boolean
}

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required()
})

export const Login = () => {
  const {state} = useLocation<{from: string}>()
  const user = useUser()

  const {handleSubmit, register, formState} = useForm<Inputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      username:"",
      password: "",
      remember_me: false
    }
  })

  const login = useLogin()

  if(user !== null) return <Redirect to={state?.from || "/"} />

  return <div className="auth-wrapper bg-light">
      <div className="auth-inner shadow-sm">
        <Form onSubmit={handleSubmit((credentials)=>{
            login.mutate(credentials)
          })}
        >
          <div className="d-flex justify-content-center"><Image src="/logo-lg.png" /></div>
          <h3 className="mb-2 text-center text-uppercase" style={{ fontSize: "1.25rem" }}>Iniciar Sesión</h3>
          {login.isError ? <Alert variant="danger" >{(login.error as any)?.response?.message || (login.error as any)?.message}</Alert> :  null}
          <Form.Group>
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              isInvalid={!!formState.errors.username}
              {...register("username")}
            />
            <Form.Control.Feedback type="invalid" >{formState.errors.username?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password"
              isInvalid={!!formState.errors.password}              
              {...register("password")}
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