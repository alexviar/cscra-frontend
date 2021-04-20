import { AxiosError, AxiosResponse } from 'axios'
import React, { useEffect } from 'react'
import { Alert, Button, Col, Form, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FaSearch } from 'react-icons/fa'
import { useMutation, useQuery } from 'react-query'
import * as rules from '../../../../commons/components/rules'
import { EmpleadorService, ListaMoraItem, ListaMoraService } from '../services'

type Inputs = {
  numeroPatronal: string,
  nombre: string
}
export default ()=>{
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState
  } = useForm<Inputs>({
    mode: "onBlur",
    defaultValues: {
      nombre: "",
      numeroPatronal: ""
    }
  })

  const numeroPatronal = watch("numeroPatronal")
  const buscarEmpleador = useQuery(["buscarEmpleadorPorPatronal", numeroPatronal], ()=>{
    return EmpleadorService.buscarPorPatronal(numeroPatronal)
  }, {
    enabled: false,
  })

  const agregarEmpleadorEnMora = useMutation((empleadorId: number)=>{
    return ListaMoraService.agregar(empleadorId)
  })
  console.log(agregarEmpleadorEnMora)

  useEffect(()=>{
    if(buscarEmpleador.data){
      setValue("nombre", buscarEmpleador.data.data.nombre)
    }
  }, [buscarEmpleador.data])

  useEffect(()=>{
    if(agregarEmpleadorEnMora.data){
      reset({
        nombre: "",
        numeroPatronal: ""
      });
    }
  }, [agregarEmpleadorEnMora.data])
  
  return <Form id="form-empleador-mora"
    onSubmit={handleSubmit((values)=>{
      agregarEmpleadorEnMora.mutate(buscarEmpleador.data!.data.id)
    })}
  >
    <h1 style={{fontSize: "2rem"}}>Agregar empleador en mora</h1>
    {buscarEmpleador.isError ? <Alert variant="danger">
      {buscarEmpleador.error!.response?.message || buscarEmpleador.error!.message}
    </Alert> : null}
    {agregarEmpleadorEnMora.isError ? <Alert variant="danger">
      {agregarEmpleadorEnMora.error!.response?.message || agregarEmpleadorEnMora.error!.message}
    </Alert> : null}
    <Form.Row>
      <Form.Group as={Col} sm={4}>
        <Form.Label>
          Nº Patronal
        </Form.Label>
        <Form.Control
          {...register("numeroPatronal")}
        />
      </Form.Group>
    </Form.Row>
    <Button className="mb-3" onClick={()=>{
      reset({
        numeroPatronal,
        nombre: "",
      })
      
      buscarEmpleador.refetch()
    }}>
      {buscarEmpleador.isFetching ? <Spinner className="mr-2" animation="border" size="sm" /> : <FaSearch className="mr-2"/>}
      Buscar
    </Button>
    <Form.Row>
      <Form.Group as={Col}>
          <Form.Label>
            Nombre
          </Form.Label>
          <Form.Control
            disabled
            isInvalid={!!formState.errors.nombre}
            {...register("nombre", {
              required: rules.required()
            })}
          />
          <Form.Control.Feedback type="invalid">{formState.errors.nombre?.message}</Form.Control.Feedback>
      </Form.Group>
    </Form.Row>
    <Button type="subimt">
      {agregarEmpleadorEnMora.isLoading ? <Spinner animation="border" size="sm" /> : null}
      Agregar
    </Button>
  </Form>
}