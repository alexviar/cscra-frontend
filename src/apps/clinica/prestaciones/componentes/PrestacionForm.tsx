import { useEffect, useRef } from "react"
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap"
import { useParams, useHistory } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { Prestacion, PrestacionesService } from "../services"
import { AxiosError } from "axios"

export type Inputs = {
  nombre: string
}

const schema = yup.object().shape({
  nombre: yup.string().trim().required().min(3).max(150)
})

export const PrestacionForm = ()=>{
  const {id} = useParams<{
    id?: string
  }>()

  const history = useHistory<{
    prestacion: Prestacion
  }>()
  
  const { state} = history.location
  
  const prestacion = state?.prestacion

  const continueRef = useRef<boolean>(false)

  const {
    handleSubmit,
    reset,
    register,
    setValue,
    formState,
  } = useForm<Inputs>({
    resolver: yupResolver(schema)
  })

  const queryClient = useQueryClient();

  const guardar = useMutation(({nombre}: Inputs)=>{
    return id ? PrestacionesService.actualizar(parseInt(id), nombre) : PrestacionesService.registrar(nombre)
  }, {
    onSuccess: ()=>{
      reset()
      queryClient.invalidateQueries("prestaciones.buscar")
      if(!continueRef.current)
        history.replace("/clinica/prestaciones")
    }
  })

  const verPrestacion = useQuery(["verPrestacion", id], ()=>{
    return PrestacionesService.ver(parseInt(id as string))
  }, {
    enabled: !!id && !prestacion,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  useEffect(()=>{
    if(verPrestacion.data?.data || prestacion){
      setValue("nombre", (verPrestacion.data?.data || prestacion).nombre)
    }
  }, [verPrestacion.data])

  const renderBody = ()=>{
    if(verPrestacion.isFetching){
      return <Spinner animation="border">Cargando</Spinner>
    }
    const error = verPrestacion.error as AxiosError
    if(error){
      return <Alert variant="danger">
        {error.response?.data?.message || error.message}
      </Alert>
    }
    return <Form id="prestacion-form"
      onSubmit={handleSubmit((inputs)=>{
        guardar.mutate(inputs)
      })}
    >
      {guardar.status == "error" || guardar.status == "success"  ? <Alert variant={guardar.isError ? "danger" : "success"}>
        {guardar.isError ? guardar.error.response?.data?.message || guardar.error.message : "Guardado"}
      </Alert> : null}
      <Form.Group>
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          isInvalid={!!formState.errors.nombre}
          {...register("nombre")}
        />
        <Form.Control.Feedback type="invalid">{formState.errors.nombre?.message}</Form.Control.Feedback>
      </Form.Group>
    </Form>
  }


  return <Modal
    show
    centered
    onHide={()=>{
      history.replace("/clinica/prestaciones")
    }}
  >
    <Modal.Header>
      {id ? "Editar" : "Registrar" }
    </Modal.Header> 
    <Modal.Body>
      {renderBody()}
    </Modal.Body>
    <Modal.Footer>
      {!id ? <Button 
        type="submit"
        form="prestacion-form"
        onClick={()=>{
          continueRef.current = true
        }}
      >
        {guardar.isLoading && continueRef.current ? <Spinner animation="border" size="sm" />: null}
        Guardar y continuar
      </Button> : null}
      <Button
        type="submit"
        form="prestacion-form"
        onClick={()=>{
          continueRef.current = false
        }}
      >
        {guardar.isLoading && !continueRef.current ? <Spinner animation="border" size="sm" />: null}
        Guardar
      </Button>
    </Modal.Footer>
  </Modal>
}