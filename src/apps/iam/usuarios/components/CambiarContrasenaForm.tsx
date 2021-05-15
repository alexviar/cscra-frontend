import { useMemo } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { useHistory, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { UserService } from '../services'

type Inputs = {
  // oldPassword: string,
  newPassword: string,
  newPasswordRepeat: string
}

export const CambiarContrasenaForm = ()=>{

  const { id } = useParams<{
    id: string
  }>()

  const history = useHistory()

  const schema = useMemo(()=>{
    return yup.object().shape({
      // oldPassword: yup.string().label("antigüa contraseña").trim().required(),
      newPassword: yup.string().label("nueva contraseña").min(8).max(32).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "La contraseña debe contener al menos un caracter en minuscula, uno en mayuscula, un número y uno de los siguientes caracter especial: !@#$%^&*")
        .required(),
      // newPasswordRepeat: yup.string().label("confirmar nueva contraseña").test("password-match", "Las contraseñas no coinciden", function (value) {
      //   const { parent: { newPassword: password } } = this
      //   return value === password
      // })
      newPasswordRepeat: yup.string().label("repita la nueva contraseña").oneOf([yup.ref("newPassword")], "Las contraseñas no coinciden")
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
      // oldPassword: "",
      newPassword: "",
      newPasswordRepeat: ""
    }
  })

  const guardar = useMutation((data: Inputs) =>{
    return UserService.cambiarContrasena(parseInt(id), {
      newPassword: data.newPassword,
      // oldPassword: data.oldPassword
    })
  }, {
    onSuccess: ({data})=>{
      history.replace("/iam/usuarios");
    }
  })

  const formErrors = formState.errors;

  console.log(formErrors)

  return <Form onSubmit={handleSubmit((data)=>{
    console.log(data)
    guardar.mutate(data)
  })}>
    <h1 style={{fontSize: "1.75rem"}}>Cambiar contraseña</h1>
    {/* <Form.Group>
      <Form.Label>Antigüa contraseña</Form.Label>
      <Form.Control
        type="password"
        isInvalid={!!formErrors.oldPassword}
        {...register("oldPassword")}
      />
      <Form.Control.Feedback type="invalid">{formErrors.oldPassword?.message}</Form.Control.Feedback>
    </Form.Group> */}
    <Form.Group>
      <Form.Label>Nueva contraseña</Form.Label>
      <Form.Control
        type="password"
        isInvalid={!!formErrors.newPassword}
        {...register("newPassword")}
      />
      <Form.Control.Feedback type="invalid">{formErrors.newPassword?.message}</Form.Control.Feedback>
    </Form.Group>
    <Form.Group>
      <Form.Label>Repita la nueva contraseña</Form.Label>
      <Form.Control
        type="password"
        isInvalid={!!formErrors.newPasswordRepeat}
        {...register("newPasswordRepeat")}
      />
      <Form.Control.Feedback type="invalid">{formErrors.newPasswordRepeat?.message}</Form.Control.Feedback>
    </Form.Group>
    <Button type="submit">
      {guardar.isLoading ? <Spinner animation="border" size="sm"/> : null}
      Guardar
    </Button>

  </Form>
}