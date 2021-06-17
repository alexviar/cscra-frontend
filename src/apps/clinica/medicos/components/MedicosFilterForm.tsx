import { Button, Col, Form } from "react-bootstrap"
import { useForm, Controller } from "react-hook-form"
import { Especialidad, EspecialidadesTypeahead } from "./EspecialidadesTypeahead"
import { MedicoFilter as Filter } from "../services"

type Inputs = {
  numCi: string
  compCi: string
  nombre: string
  especialidad: Especialidad[]
  tipo: string
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
  } = useForm<Inputs>({
    defaultValues: {
      tipo: "",
      especialidad: []
    }
  })
  return <Form onSubmit={handleSubmit((data) => {
    const filter: Filter = {}
    if(data.numCi) filter.ci = data.numCi
    if(data.compCi) filter.ciComplemento = data.compCi
    if(data.nombre) filter.nombre = data.nombre
    if(data.especialidad) filter.especialidadId = data.especialidad.length && data.especialidad[0].id
    if(data.tipo) filter.tipo = parseInt(data.tipo)
    props.onFilter(filter)
  })}>
    <Form.Row>
      <Form.Group as={Col}>
        <Form.Label>Tipo</Form.Label>
        <div>
          <Form.Check inline type="radio" value="" label="Todos" {...register("tipo")} />
          <Form.Check inline type="radio" value="1" label="Empleados" {...register("tipo")} />
          <Form.Check inline type="radio" value="2" label="Proveedores" {...register("tipo")} />
        </div>
      </Form.Group>
    </Form.Row>
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
        <Controller
          control={control}
          name="especialidad"
          render={({field: {ref, value, ...field}})=>{
            return <EspecialidadesTypeahead
              id="medicos-filter/especialidades"
              selected={value}
              {...field}
            />
          }}
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