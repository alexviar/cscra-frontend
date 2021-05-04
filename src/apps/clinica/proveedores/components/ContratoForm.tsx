import { useEffect } from "react"
import { Alert, Button, Col, Form, Spinner } from "react-bootstrap"
import { FormProvider, useForm } from "react-hook-form"
import { useParams, useHistory } from "react-router"
import { useMutation } from "react-query"
import { PrestacionesContratadasControl, Inputs as PCInputs } from "./PrestacionesContratadasControl"
import { ContratosService } from "../services"
import * as rules from "../../../../commons/components/rules"

type Inputs = {
  inicio: string,
  fin: string,
  tipoContratoId: string,
  modalidadPagoId: string,
  contrato: FileList
} & PCInputs

export const ContratoForm = (props: {next?: ()=>void})=>{
  const {idProveedor} = useParams<{
    idProveedor: string
  }>()
  const history = useHistory<{
    proveedor: {id: number}
  }>()
  const methods = useForm<Inputs>({
    defaultValues: {
      prestaciones: [{
        // aranceles: [{}]
      }]
    }
  })

  const guardar = useMutation((values: Inputs)=>{
    return ContratosService.registrar(parseInt(idProveedor) || history.location.state!.proveedor!.id, {
      inicio: values.inicio,
      fin: values.fin,
      prestacion_ids: values.prestaciones.map(p=>p.prestacion.id)
    })
  })

  const {
    handleSubmit,
    register,
    formState,
    control
  } = methods

  useEffect(()=>{
    if(guardar.data){
      if(props.next){
        props.next()
      }
      else{
        history.replace(`/clinica/proveedores/${parseInt(idProveedor) || history.location.state!.proveedor!.id}#contratos`)
      }
    }
  }, [guardar.data])

  return <FormProvider {...methods}>
    <Form onSubmit={handleSubmit((values)=>{
      console.log(values)
      guardar.mutate(values)
    })}>
      <h1 style={{fontSize: "1.75rem"}}>Contrato</h1>
      <Form.Row>
        <Form.Group as={Col} sm={6}>
          <Form.Label>Inicio</Form.Label>
          <Form.Control type="date"
            isInvalid={!!formState.errors.inicio}
            {...register("inicio", {
              required: rules.required()
            })}
          />
          <Form.Control.Feedback type="invalid">{formState.errors.inicio?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} sm={6}>
          <Form.Label>Fin</Form.Label>
          <Form.Control type="date"
            isInvalid={!!formState.errors.fin}
            {...register("fin", {
              required: rules.required()
            })}
          />
          <Form.Control.Feedback type="invalid">{formState.errors.fin?.message}</Form.Control.Feedback>
        </Form.Group>
      </Form.Row>
      {/* <Form.Row>
        <Form.Group as={Col} sm={6}>
          <Form.Label>Tipo de contrato</Form.Label>
          <Form.Row className="is-invalid">
            <Col><Form.Check inline type="radio" label="Contrato" value="1"
              {...register("tipoContratoId", {
                required: rules.required()
              })}
            /></Col>
            <Col><Form.Check inline type="radio" label="Convenio" value="2"
              {...register("tipoContratoId", {
                required: rules.required()
              })}
            /></Col>
          </Form.Row>
          <Form.Control.Feedback type="invalid">{formState.errors?.tipoContratoId?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} sm={6}>
          <Form.Label>Modalidad de pago</Form.Label>
          <Form.Row className="is-invalid text-nowrap">
            <Col><Form.Check inline type="radio" label="Mensualizado" value="1"
              {...register("modalidadPagoId", {
                required: rules.required()
              })}
            /></Col>
            <Col><Form.Check inline type="radio" label="Por trabajo realizado" value="2"
              {...register("modalidadPagoId", {
                required: rules.required()
              })}
            /></Col>
          </Form.Row>
          <Form.Control.Feedback type="invalid">{formState.errors?.modalidadPagoId?.message}</Form.Control.Feedback>
        </Form.Group>
      </Form.Row> */}
      {/* <Form.Row>
        <Form.Group as={Col} xs="auto">
          <Form.Row>
            <Form.Label column xs="auto">Contrato</Form.Label>
            <Form.File
              as={Col}
              className="my-auto"
              isInvalid={!!formState.errors.contrato}
              {...register("contrato")}
              feedback={formState.errors.contrato?.message}
            />
          </Form.Row>
        </Form.Group>
      </Form.Row> */}
      <Form.Row>
        <Col>
          <PrestacionesContratadasControl />
        </Col>
      </Form.Row>
      <Form.Row>
        <Col>
          <Button type="submit">
            {guardar.isLoading ? <Spinner animation="border" size="sm"/> : null}
            <span className="ml-1 align-middle">Guardar</span>
          </Button>
        </Col>
      </Form.Row>
    </Form>
  </FormProvider>
}