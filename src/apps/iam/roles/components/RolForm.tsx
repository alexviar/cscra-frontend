import { useMemo, useEffect } from 'react'
import { Button, Form, Col, Spinner } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useHistory, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useModal } from '../../../../commons/reusable-modal'
import {PermisoCheckList} from './PermisoCheckList'
import { RolService, Rol, Permiso } from '../services'

type Inputs = {
  name: string,
  description: string,
  permissions: Permiso[]
}
export const RolForm = () => {

  const schema = useMemo(()=>{
    return yup.object().shape({
      name: yup.string().label("nombre").trim()/*.lowercase()*/.required("El nombre es requerido").max(50, "Ha excedido el limite de $max caracteres"),
      description: yup.string().label("descripcion").max(250, "Ha excedido el limite de $max caracteres"),
      permissions: yup.array().label("permisos").min(1, "Debe marcar al menos 1 permiso")
    })
  }, [])
  
  const {
    handleSubmit,
    register,
    control,
    formState,
    reset,
    setError
  } = useForm<Inputs>({
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      permissions: []
    }
  })

  const { id } = useParams<{
    id: string
  }>()
  const history = useHistory<{
    rol?: Rol,
    ignoreAuthorization?: boolean
  }>()

  const queryLoader = useModal('queryLoader')

  const queryClient = useQueryClient()

  const cargar = useQuery(["fetchRole", id], ()=>{
    return RolService.cargar(parseInt(id))
  }, {
    enabled: !!id && !history.location.state?.rol,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const guardar = useMutation((data: Inputs)=>{
    if(id){
      return RolService.actualizar(parseInt(id), {
        name: data.name,
        description: data.description,
        permissions: data.permissions
      })
    }
    else{
      return RolService.registrar({
        name: data.name,
        description: data.description,
        permissions: data.permissions
      })
    }
  }, {
    onSuccess: ({data}) => {
      queryClient.invalidateQueries("roles.buscar")
      history.replace(`/iam/roles/${data.id}`, {
        rol: data,
        ignoreAuthorization: true
      })
    },
    onError: (error: AxiosError) => {
      if(error!.response?.status !== 422)
        queryLoader.open({
          state: "error",
          error
        })
    }
  })
  const rol = cargar.data?.data || history.location.state?.rol
  const formErrors = formState.errors

  useEffect(()=>{
    if(rol) {
      reset({
        name: rol.name,
        description: rol.description,
        permissions: rol.permissionNames,
      })
    }
  }, [rol])

  useEffect(()=>{
    if(cargar.isFetching){
      queryLoader.open({
        state: "loading",
      })
    }
  }, [cargar.isFetching])

  useEffect(()=>{
    if(guardar.error){
      const error = (guardar.error as AxiosError)
      if(error.response?.status == 422){
        const { errors } = error.response.data
        if(errors.name) setError("name", {message: errors.name})
        if(errors.description) setError("description", {message: errors.description})
        if(errors.permissions) setError("permissions", {message: errors.permissions})
      }      
    }
  }, [guardar.error])

  return <>
    <Form noValidate validated={formState.isValid} onSubmit={handleSubmit((data) => {
      guardar.mutate(data)
    })}>
      <h1 style={{ fontSize: "2rem" }}>Roles</h1>
      <Form.Group>
        <Form.Label >Nombre</Form.Label>
        <Form.Control 
          isInvalid={!!formState.errors.name}
          {...register("name")}
        ></Form.Control>
        <Form.Control.Feedback type="invalid">{formErrors.name?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Descripcion</Form.Label>
        <Form.Control
          as="textarea"
          isInvalid={!!formErrors.description}
          {...register("description")}
        ></Form.Control>
        <Form.Control.Feedback type="invalid">{formErrors.description?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Permisos</Form.Label>
        <Controller
          name="permissions"
          control={control}
          render={({ field, fieldState }) => {
            return <><PermisoCheckList
              isInvalid={!!fieldState.error}
              onChange={field.onChange}
              // onBlur={field.onBlur}
              selected={field.value}
            />
            <Form.Control.Feedback type="invalid">{fieldState.error?.message}</Form.Control.Feedback></>
          }}
        />

      </Form.Group>
      <Form.Row>
        <Col>
          <Button type="submit">
            {guardar.isLoading ? <Spinner animation="border" className="mr-2" size="sm" /> : null}
            <span className="align-middle">Registrar</span>
          </Button>
        </Col>
      </Form.Row>
    </Form>
  </>
}