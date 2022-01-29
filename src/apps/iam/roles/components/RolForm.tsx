import { useMemo, useEffect } from 'react'
import { Alert, Breadcrumb, Button, Form, Col, Spinner } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Link, useHistory, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {PermisoCheckList} from './PermisoCheckList'
import { RolService, Rol, Permiso } from '../services'
import { useServerValidation } from '../../../../commons/hooks'
import { LazyControl } from '../../../../commons/components'

type Inputs = {
  initialized: boolean,
  name: string,
  description: string,
  permissions: Permiso[]
}
export const RolForm = () => {
  const { id } = useParams<{
    id: string
  }>()
  const history = useHistory<{
    rol?: Rol,
    ignoreAuthorization?: boolean
  }>()

  const schema = useMemo(()=>{
    return yup.object().shape({
      name: yup.string().label("nombre").trim()/*.lowercase()*/.required("El nombre es requerido").max(125, "Ha excedido el limite de $max caracteres"),
      description: yup.string().label("descripcion").max(250, "Ha excedido el limite de $max caracteres").nullable().optional(),
      permissions: yup.array().label("permisos").min(1, "Debe marcar al menos 1 permiso")
    })
  }, [])
  
  const {
    control,
    formState,
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    watch
  } = useForm<Inputs>({
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: {
      initialized: !id,
      name: "",
      description: "",
      permissions: []
    }
  })

  const initialized = watch("initialized")

  const queryClient = useQueryClient()

  const cargar = useQuery(["roles", "cargar", id], ()=>{
    return RolService.cargar(parseInt(id))
  }, {
    enabled: !!id && !initialized,
    initialData: history.location.state?.rol && {status: 200, statusText: "OK", data: history.location.state.rol, headers: {}, config: {}},
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onError: () => setValue("initialized", true)
  })
  
  const rol = cargar.data?.data || history.location.state?.rol
    
  useEffect(()=>{
    if(rol) {
      setValue("initialized", true)
      setValue("name", rol.name)
      setValue("description", rol.description)
      setValue("permissions", rol.permissions.map(p=>p.name))
    }
  }, [rol])

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
    onSuccess: (response)=>{
      queryClient.invalidateQueries(["roles", "buscar"])
      if(id) {
        queryClient.setQueryData(["roles", "cargar", id], response)
        // history.push("/iam/roles")
      }
      else{
        reset({
          initialized: true,
          name: "",
          description: "",
          permissions: []
        })
      }
    }
  })

  useServerValidation(guardar.error as AxiosError, setError)

  const formErrors = formState.errors

  const renderAlert = ()=>{
    return  guardar.status == "error" || guardar.status == "success"  ? <Alert variant={guardar.isError ? "danger" : "success"}>
      {guardar.isError ? (guardar.error as AxiosError).response?.data?.message || (guardar.error as AxiosError).message : "Guardado"}
    </Alert> : null
  }

  return <div>
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{to: "/iam/roles"}}>Roles</Breadcrumb.Item>
      {id ? <Breadcrumb.Item active>{id}</Breadcrumb.Item> : null}
      <Breadcrumb.Item active>{!id ? "Registro" : "Actualización"}</Breadcrumb.Item>
    </Breadcrumb>
    <Form onSubmit={handleSubmit((data) => {
      guardar.mutate(data)
    })}>
      {renderAlert()}
      <Form.Group>
        <Form.Label >Nombre</Form.Label>
        <LazyControl
          initialized={initialized}
          isInvalid={!!formState.errors.name}
          className="text-uppercase"
          {...register("name")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.name?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Descripcion</Form.Label>
        <LazyControl
          initialized={initialized}
          as="textarea"
          isInvalid={!!formErrors.description}
          className="text-uppercase"
          {...register("description")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.description?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Permisos</Form.Label>
        <Controller
          name="permissions"
          control={control}
          render={({ field, fieldState }) => {
            return <><PermisoCheckList
              initialized={initialized}
              isInvalid={!!fieldState.error}
              onChange={field.onChange}
              // onBlur={field.onBlur}
              selected={field.value}
            />
            <Form.Control.Feedback type="invalid">{fieldState.error?.message}</Form.Control.Feedback></>
          }}
        />
      </Form.Group>
      <Form.Row className="mt-2">
        <Col>
          <Button type="submit">
            {guardar.isLoading ? <Spinner animation="border" className="mr-2" size="sm" /> : null}
            <span className="align-middle">Guardar</span>
          </Button>
        </Col>
      </Form.Row>
    </Form>
  </div>
}