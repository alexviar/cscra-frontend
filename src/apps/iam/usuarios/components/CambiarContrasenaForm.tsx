import { useMemo } from 'react'
import { AxiosError } from 'axios'
import { Alert, Button, Form, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { useHistory, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { UserService } from '../services'
import { useUser } from '../../../../commons/auth'

type Inputs = {
  oldPassword: string
  password: string
  passwordRepeat: string
}

export const CambiarContrasenaForm = ()=>{

  const user = useUser()

  const { id = user!.id as any} = useParams<{
    id: string
  }>()

  const history = useHistory()

  const schema = useMemo(()=>{
    return yup.object().shape({
      oldPassword: !id ? yup.string().label("antigüa contraseña").trim().required() : yup.mixed().notRequired(),
      password: yup.string().label("nueva contraseña").min(8).max(32).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "La contraseña debe contener al menos un caracter en minuscula, uno en mayuscula, un número y uno de los siguientes caracter especial: !@#$%^&*")
        .required(),
      passwordRepeat: yup.string().label("repita la nueva contraseña").oneOf([yup.ref("password")], "Las contraseñas no coinciden")
    })
  }, [])

  const {
    formState,
    handleSubmit,
    register
  } = useForm<Inputs>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      oldPassword: "",
      password: "",
      passwordRepeat: ""
    }
  })

  console.log(id);

  const guardar = useMutation((data: Inputs) =>{
    const parsedId = parseInt(id)
    return UserService.cambiarContrasena(parsedId, {
      password: data.password,
      oldPassword: data.oldPassword
    })
  }, {
    onSuccess: ({data})=>{
      // history.replace("/iam/usuarios");
    }
  })

  const formErrors = formState.errors;

  return <Form onSubmit={handleSubmit((data)=>{
    guardar.mutate(data)
  })}>
    <h1 style={{fontSize: "1.75rem"}}>Cambiar contraseña</h1>
    {guardar.status == "error" || guardar.status == "success"  ? <Alert variant={guardar.isError ? "danger" : "success"}>
      {guardar.isError ? (guardar.error as AxiosError).response?.data?.message || (guardar.error as AxiosError).message : "Guardado"}
    </Alert> : null}
    {!id ? <Form.Group>
      <Form.Label>Antigüa contraseña</Form.Label>
      <Form.Control
        type="password"
        isInvalid={!!formErrors.oldPassword}
        {...register("oldPassword")}
      />
      <Form.Control.Feedback type="invalid">{formErrors.oldPassword?.message}</Form.Control.Feedback>
    </Form.Group> : null}
    <Form.Group>
      <Form.Label>Nueva contraseña</Form.Label>
      <Form.Control
        type="password"
        isInvalid={!!formErrors.password}
        {...register("password")}
      />
      <Form.Control.Feedback type="invalid">{formErrors.password?.message}</Form.Control.Feedback>
    </Form.Group>
    <Form.Group>
      <Form.Label>Repita la nueva contraseña</Form.Label>
      <Form.Control
        type="password"
        isInvalid={!!formErrors.passwordRepeat}
        {...register("passwordRepeat")}
      />
      <Form.Control.Feedback type="invalid">{formErrors.passwordRepeat?.message}</Form.Control.Feedback>
    </Form.Group>
    <Button type="submit">
      {guardar.isLoading ? <Spinner animation="border" size="sm"/> : null}
      Guardar
    </Button>

  </Form>
}