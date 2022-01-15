import { Button, Col, Form } from "react-bootstrap"
import { useForm, Controller } from "react-hook-form"
import { MedicoFilter as Filter } from "../services"

type Inputs = {
  numCi?: string
  compCi?: string
  nombre?: string
  especialidad?: string
}

type Props = {
  onFilter: (filter: Filter) => void
}

export const MedicosFilterForm = (props: Props) => {
  const {
    control,
    handleSubmit,
    register,
    reset
  } = useForm<Inputs>()
  
  return <Form onSubmit={handleSubmit((data) => {
    const filter: Filter = {}
    if(data.numCi) filter.ci = data.numCi
    if(data.compCi) filter.ciComplemento = data.compCi
    if(data.nombre) filter.nombre = data.nombre
    if(data.especialidad) filter.especialidad = data.especialidad
    props.onFilter(filter)
  })}>
    <Form.Row>
      <Form.Group as={Col} sm={4} lg={3}>
        <Form.Label>Nº Carnet</Form.Label>
        <Form.Control {...register("numCi")} />
      </Form.Group>
      <Form.Group as={Col} sm={2} lg={1}>
        <Form.Label>Comp. Carnet</Form.Label>
        <Form.Control {...register("compCi")} />
      </Form.Group>
      <Form.Group as={Col} sm={6} lg={8}>
        <Form.Label>Nombre</Form.Label>
        <Form.Control {...register("nombre")} />
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col}>
        <Form.Label>Especialidad</Form.Label>
        <Form.Control
          {...register("especialidad")}
        />
      </Form.Group>
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