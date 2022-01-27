import { useEffect, useState } from 'react'
import { Alert, Breadcrumb, Button, Col, Form, InputGroup, Spinner } from 'react-bootstrap'
import { FieldError, useForm } from 'react-hook-form'
import { Link, useHistory } from "react-router-dom"
import { FaSearch } from 'react-icons/fa'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { Empleador, EmpleadorService, ListaMoraItem, ListaMoraService } from '../services'
import { useUser } from '../../../../commons/auth'
import { listaMoraPolicy } from '../policies'
import { EmpleadorChooser } from './EmpleadorChooser'

type Inputs = {
  empleador: Empleador
}

const schema = yup.object().shape({
  empleador: yup.object().when("$empleador", function(empleador:Empleador, schema: yup.ObjectSchema<any>){
    if(!empleador) return schema.test("", "", function(value: any, context: any){
      return context.createError({
        message: "Debe indicar un empleador"
      })
    })
    return schema
  })
})

export default ()=>{
  const [empleador, setEmpleador] = useState<Empleador|null>(null)
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
    context: {empleador},
    resolver: yupResolver(schema)
  })

  const formErrors = formState.errors

  const user = useUser()

  const [showChooser, setShowChooser] = useState(false)

  const history = useHistory()

  const queryClient = useQueryClient()
  
  const buscarEmpleador = useQuery(["empleadores", "buscar", "porPatronal"], ()=>{
    return EmpleadorService.buscar({current: 1, size: 10}, {
      numeroPatronal: watch("empleador.numeroPatronal"),
      regionalId: listaMoraPolicy.registerByRegionalOnly(user) ? user!.regionalId : undefined
    })
  }, {
    enabled: false,
    onSuccess: ({data}) =>{
      if(data.records.length == 1){
        setEmpleador(data.records[0])
      }
      else {
        setShowChooser(true)
      }
    }
  })

  const guardar = useMutation((empleadorId: string)=>{
    return ListaMoraService.agregar(empleadorId)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries("listaMora.buscar")
      history.replace("/clinica/lista-mora")
    }
  })

  useEffect(()=>{
    const error = guardar.error as any
    if(error?.response?.status == 422) {
      const {errors} = error?.response?.data
      Object.keys(errors).forEach((key: any)=>{
        let localKey = key
        if(key == "empleadorId") localKey = "numeroPatronal"
        setError(localKey, {type: "serverError", message: errors[key]})
      })
    }
  }, [guardar.isError])

  useEffect(()=>{
    if(empleador) {
      setValue("empleador", empleador)
    }
  }, [empleador])
  const renderAlert = ()=>{
    if((formErrors.empleador as FieldError)?.message){
      return <Alert variant="danger">
        {(formErrors.empleador as FieldError)?.message}
      </Alert>
    }
    if(guardar.isSuccess){
      return <Alert variant="success">
        La operacion se realizó exitosamente
      </Alert>
    }
    if(guardar.error && (guardar.error as any).response?.status != 422){
      return <Alert variant="danger">
        Ocurrio un error al realizar la solicitud
      </Alert>
    }
    return null
  }

  const { onChange: onChangeNumeroPatronal, ...numeroPatronalField} = register("empleador.numeroPatronal")

  return <div>
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{to: "/clinica/lista-mora"}}>Lista de mora</Breadcrumb.Item>
      <Breadcrumb.Item active>Registro</Breadcrumb.Item>
    </Breadcrumb>
    <Form id="form-empleador-mora"
      onSubmit={handleSubmit(({empleador})=>{
        guardar.mutate(empleador.id)
    })}>
      {renderAlert()}
      <Form.Row>
        <Form.Group as={Col} sm={4}>
          <Form.Label>
            Nº Patronal
          </Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              className="text-uppercase"
              isInvalid={buscarEmpleador.isError}
              {...numeroPatronalField}
              onChange={(e)=>{
                setEmpleador(null)
                onChangeNumeroPatronal(e)
              }}
            />
            <InputGroup.Append >
              <Button variant={buscarEmpleador.isError ? "danger" : "outline-secondary"} onClick={()=>{
                  clearErrors()
                  buscarEmpleador.refetch()
              }}>
                {buscarEmpleador.isFetching ? <Spinner animation="border" size="sm" /> : <FaSearch />}
              </Button>
            </InputGroup.Append>
            <Form.Control.Feedback type="invalid">Ocurrio un error al realizar la busqueda</Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} sm={4}>
            <Form.Label>
              ID
            </Form.Label>
            <Form.Control
              readOnly
              {...register("empleador.id")}
            />
        </Form.Group>
        <Form.Group as={Col} sm={8}>
            <Form.Label>
              Nombre
            </Form.Label>
            <Form.Control
              readOnly
              {...register("empleador.nombre")}
            />
        </Form.Group>
      </Form.Row>
      <Button type="subimt">
        {guardar.isLoading ? <Spinner className="mr-2" animation="border" size="sm" /> : null}
        Guardar
      </Button>
    </Form>
    <EmpleadorChooser show={showChooser}
      empleadores={buscarEmpleador.data?.data.records || []}
      onSelect={(empleador)=>{
        setEmpleador(empleador)
        setShowChooser(false)
      }}
      onHide={()=>setShowChooser(false)}
    />
  </div>
}