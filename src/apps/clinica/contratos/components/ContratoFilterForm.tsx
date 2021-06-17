import { Button, Col, Form } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { Filter } from "../services"

type Inputs = {
  desde: string
  hasta: string
}

type Props = {
  onApply: (filter: Filter) => void
}

export const ContratoFilterForm = (props: Props)=>{
  const {
    handleSubmit,
    register,
    reset
  } = useForm<Inputs>()

  return <Form onSubmit={handleSubmit((inputs)=>{
    const filter: Filter = {}
    if(inputs.desde) filter.desde = inputs.desde
    if(inputs.hasta) filter.hasta = inputs.hasta
    props.onApply(filter)
  })}>
    <Form.Row>
      <Form.Group as={Col} sm={4}>
        <Form.Label>Desde</Form.Label>
        <Form.Control type="date" {...register("desde")} />
      </Form.Group>
      <Form.Group as={Col} sm={4}>
        <Form.Label>Hasta</Form.Label>
        <Form.Control type="date" {...register("hasta")} />
      </Form.Group>
      {/* <Form.Group as={Col} sm={4}>
        <Form.Label>Nombre</Form.Label>
        <Form.Control {...register("estado")} />
      </Form.Group> */}
    </Form.Row>
    <Form.Row>
      <Col xs="auto">
        <Button type="submit">Aplicar</Button>
      </Col>
      <Col xs="auto">
        <Button variant="secondary" onClick={()=>reset()}>Limpiar</Button>
      </Col>
    </Form.Row>
  </Form>
}