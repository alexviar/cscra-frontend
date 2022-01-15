import { Button, Col, Form } from "react-bootstrap"
import { useForm, Controller } from "react-hook-form"
import { Filter } from "../services"

type Inputs ={
  tipos: {
    medicos: boolean
    empresas: boolean
  }
  nombre: string
  prestaciones: string
}

type Props = {
  onFilter: (filter: Filter) => void
}

export const ProveedoresFilterForm = (props: Props)=>{
  const {
    control,
    handleSubmit,
    register,
    reset
  } = useForm<Inputs>()
  
  return <Form onSubmit={handleSubmit((inputs)=>{
    const filter: Filter = {tipos: []}
    if(inputs.tipos.medicos) filter.tipos!.push(1)
    if(inputs.tipos.empresas) filter.tipos!.push(2)
    if(!filter.tipos!.length) delete filter.tipos
    if(inputs.nombre) filter.nombre = inputs.nombre
    props.onFilter(filter)
  })}>
    <Form.Row>
      <Form.Group as={Col} xs="auto">
        <Form.Label>Tipo</Form.Label>
        <div>
          <Form.Check inline
            type="checkbox"
            label="Médicos"
            {...register("tipos.medicos")} />
          <Form.Check inline
            type="checkbox"
            label="Empresas"
            {...register("tipos.empresas")} />
        </div>
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>Nombre</Form.Label>
        <Form.Control {...register("nombre")}/>
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