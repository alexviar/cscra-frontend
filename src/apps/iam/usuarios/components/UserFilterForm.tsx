import { Button, Col, Form } from "react-bootstrap"
import { useForm, Controller } from "react-hook-form"
import { UserFilter as Filter } from "../services"

type Inputs = {
  numCi: string
  compCi: string
  nombre: string
  username: string
}

type Props = {
  onFilter: (filter: Filter) => void
}

export const UserFilterForm = (props: Props) => {
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
    if(data.nombre) filter.nombreCompleto = data.nombre
    if(data.username) filter.username = data.username
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
      <Form.Group as={Col} sm="6">
        <Form.Label>Nombre de usuario</Form.Label>
        <Form.Control {...register("username")} />
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