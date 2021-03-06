import { AxiosError, AxiosResponse } from 'axios'
import { useEffect } from 'react'
import { Alert, Button, Col, Form, InputGroup, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useHistory } from "react-router-dom"
import { FaSearch } from 'react-icons/fa'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { EmpleadorService, ListaMoraItem, ListaMoraService } from '../services'

type Inputs = {
  numeroPatronal: string,
  nombre: string
}

const schema = yup.object().shape({
  numeroPatronal: yup.string().label("número patronal").trim().uppercase().required(),
  nombre: yup.string().required()
})

export default ()=>{
  const {
    handleSubmit,
    register,
    watch,
    setError,
    clearErrors,
    setValue,
    reset,
    trigger,
    formState
  } = useForm<Inputs>({
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
      numeroPatronal: ""
    }
  })

  const formErrors = formState.errors
  
  console.log("Vlues", watch(), formErrors)

  const history = useHistory()

  const queryClient = useQueryClient()
  
  const onBuscarEmpleadorSuccess = ({data}: any) => {
    console.log("Nombre",data.nombre)
    setValue("nombre", data.nombre)
  }
  const numeroPatronal = watch("numeroPatronal")
  const buscarEmpleador = useQuery(["buscarEmpleadorPorPatronal", numeroPatronal], ()=>{
    return EmpleadorService.buscarPorPatronal(numeroPatronal)
  }, {
    enabled: false,
    onSuccess: onBuscarEmpleadorSuccess
  })

  const guardar = useMutation((empleadorId: number)=>{
    return ListaMoraService.agregar(empleadorId)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries("listaMora.buscar")
      history.replace("/clinica/lista-mora")
    }
  })

  useEffect(()=>{
    if(buscarEmpleador.isError){
      const error = buscarEmpleador.error as AxiosError
      setError("numeroPatronal", {
        type: "searchError",
        message: error.response?.status == 404 ? "Empleador no encontrado" : "Ocurrio un error"
      })
    }
  }, [buscarEmpleador.isError])

  const renderAlert = ()=>{
    if(guardar.isSuccess){
      return <Alert variant="success">
      La operacion se realizó exitosamente
    </Alert>
    }
    if(guardar.isError){
      const guardarError = guardar.error as AxiosError
      return <Alert variant="danger">
        {guardarError.response?.data?.message || guardarError.message}
      </Alert>
    }
    return null
  }

  return <Form id="form-empleador-mora"
    onSubmit={handleSubmit(()=>{
      guardar.mutate(buscarEmpleador.data!.data.id)
    })}
  >
    <h1 style={{fontSize: "1.75rem"}}>Agregar empleador en mora</h1>
    {renderAlert()}
    <Form.Row>
      <Form.Group as={Col} sm={4}>
        <Form.Label>
          Nº Patronal
        </Form.Label>
        <InputGroup hasValidation className="mb-2">
          <Form.Control
            isInvalid={!!formErrors.numeroPatronal}
            className="text-uppercase" {...register("numeroPatronal")} />
          <InputGroup.Append >
            <Button variant={formErrors.numeroPatronal ? "danger" : "outline-secondary"} onClick={()=>{
              trigger("numeroPatronal")
              .then((valid)=>{
                if(!formErrors.numeroPatronal){
                  clearErrors()
                  if(!buscarEmpleador.data){
                    buscarEmpleador.refetch()
                  }
                }
              })
            }}>
              {buscarEmpleador.isFetching ? <Spinner animation="border" size="sm" /> : <FaSearch />}
            </Button>
          </InputGroup.Append>
          <Form.Control.Feedback type="invalid">{formErrors.numeroPatronal?.message}</Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col}>
          <Form.Label>
            Nombre
          </Form.Label>
          <Form.Control
            readOnly
            isInvalid={!!formState.errors.nombre}
            {...register("nombre")}
          />
          <Form.Control.Feedback type="invalid">{formState.errors.nombre?.message}</Form.Control.Feedback>
      </Form.Group>
    </Form.Row>
    <Button type="subimt">
      {guardar.isLoading ? <Spinner className="mr-2" animation="border" size="sm" /> : null}
      <span className=""></span>Agregar
    </Button>
  </Form>
}