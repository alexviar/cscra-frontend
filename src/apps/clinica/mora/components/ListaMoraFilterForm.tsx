import { Button, Col, Form } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { ListaMoraFilter as Filter } from "../services"

type Inputs = {
  numeroPatronal: string
  nombre: string
}

type Props = {
  onApply: (filter: Filter) => void
}

export const ListaMoraFilterForm = (props: Props)=>{
  const {
    handleSubmit,
    register,
    reset
  } = useForm<Inputs>()

  return <Form onSubmit={handleSubmit((inputs)=>{
    const filter: Filter = {}
    if(inputs.nombre) filter.nombre = inputs.nombre
    if(inputs.numeroPatronal) filter.numeroPatronal = inputs.numeroPatronal
    props.onApply(filter)
  })}>
    <Form.Row>
      <Form.Group as={Col} sm={4}>
        <Form.Label htmlFor="numeroPatronal">N.º Patronal</Form.Label>
        <Form.Control id="numeroPatronal" {...register("numeroPatronal")} />
      </Form.Group>
      <Form.Group as={Col} sm={8}>
        <Form.Label htmlFor="nombre">Nombre</Form.Label>
        <Form.Control id="nombre" {...register("nombre")} />
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