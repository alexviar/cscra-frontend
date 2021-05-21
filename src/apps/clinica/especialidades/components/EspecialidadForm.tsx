import { useEffect, useRef } from "react"
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap"
import { useParams, useHistory } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useMutation, useQuery} from "react-query"
import * as rules from "../../../../commons/components/rules"
import { Especialidad, EspecialidadesService } from "../services"
import { AxiosError } from "axios"

export type Inputs = {
  nombre: string
}

export const EspecialidadForm = ()=>{
  const {id} = useParams<{
    id?: string
  }>()

  const history = useHistory<{
    especialidad: Especialidad
  }>()
  
  const { state} = history.location

  const continueRef = useRef<boolean>(false)

  const {
    handleSubmit,
    register,
    setValue,
    formState,
  } = useForm<Inputs>()

  const guardar = useMutation(({nombre}: Inputs)=>{
    return id ? EspecialidadesService.actualizar(parseInt(id), nombre) : EspecialidadesService.registrar(nombre)
  }, {
    onSuccess: ()=>{
      if(!continueRef.current)
        history.replace("/clinica/configuracion/especialidades")
    }
  })

  const cargar = useQuery(["especialidades.cargar", id], ()=>{
    return EspecialidadesService.ver(parseInt(id as string))
  }, {
    enabled: !!id && !history.location.state?.especialidad,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const especialidad = cargar.data?.data || history.location.state?.especialidad

  useEffect(()=>{
    if(especialidad){
      setValue("nombre", especialidad.nombre)
    }
  }, [especialidad])

  const renderBody = ()=>{
    if(cargar.isFetching){
      return <Spinner animation="border">Cargando</Spinner>
    }
    const error = cargar.error as AxiosError
    if(error){
      return <Alert variant="danger">
        {error.response?.data?.message || error.message}
      </Alert>
    }
    return <Form id="especialidad-form"
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
          {...register("nombre", {
            required: rules.required()
          })}
        />
        <Form.Control.Feedback type="invalid">{formState.errors.nombre?.message}</Form.Control.Feedback>
      </Form.Group>
    </Form>
  }


  return <Modal
    show
    centered
    onHide={()=>{
      history.replace("/clinica/configuracion/especialidades")
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
        form="especialidad-form"
        onClick={()=>{
          continueRef.current = true
        }}
      >
        {guardar.isLoading && continueRef.current ? <Spinner animation="border" size="sm" />: null}
        Guardar y continuar
      </Button> : null}
      <Button
        type="submit"
        form="especialidad-form"
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