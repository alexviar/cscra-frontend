import React, { useEffect } from "react"
import { Button, Form, Spinner } from "react-bootstrap"
import { FormProvider, useForm } from "react-hook-form"
import { useMutation, useQuery } from "react-query"
import { useParams } from "react-router"
import { Users } from "../services"
import RolesCheckList from "./RolesCheckList"

type Inputs = {
  username: string,
  roleIds: number[]
}
export default ()=>{
  const {userId} = useParams<{userId: string}>()
  const formMethods = useForm<Inputs>({
    mode: "onBlur",
    defaultValues: {
      username: "",
      roleIds: [] as number[]
    }
  })
  const { register, reset, handleSubmit, watch, formState: {errors}, formState: { isValid} } = formMethods
  console.log("Fields", watch())
  const editUser = useMutation(Users.update)

  const loadUser = useQuery(["loadUser", userId], () => {
    return Users.load(parseInt(userId))
  }, {
    enabled: false
  })

  useEffect(()=>{
    loadUser.refetch()
  }, [userId])

  useEffect(()=>{
    if(loadUser.data){
      reset({
        username: loadUser.data.data.username,
        roleIds: loadUser.data.data.roleIds
      })
    }
  }, [loadUser.data])

  return <FormProvider {...formMethods} >
    <Form onSubmit={handleSubmit((data)=>{
      editUser.mutate({
        id: parseInt(userId),
        username: data.username,
        roleIds: data.roleIds
      })
    })}>
      <Form.Group controlId="username">
        <Form.Label >Nombre de usuario</Form.Label>
        <Form.Control
          isInvalid={!!errors.username}
          {...register("username", {
            pattern: { value: /^\S*$/, message: "Este campo no debe contener espacios."},
            required: {value: true, message: "Este campo es requerido."},
            minLength: {value: 4, message: "Este campo no debe tener al menos 4 caracteres."},
            maxLength: {value: 16, message: "Este campo no debe exceder los 16 caracteres."}
          })}
        ></Form.Control>
        <Form.Control.Feedback type="invalid">{errors.username?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Roles</Form.Label>
        <RolesCheckList />
      </Form.Group>
      <Button type="submit">
        {editUser.isLoading ? <Spinner animation="border" size="sm" /> : null}
        <span className="ml-2">Registrar</span>
      </Button>
    </Form>
</FormProvider>
}