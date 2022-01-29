import { Button, Col, InputGroup, Form } from "react-bootstrap"
import { useForm, Controller } from "react-hook-form"
import { useUser } from "../../../../commons/auth"
import { Regional, RegionalesTypeahead } from "../../../../commons/components"
import { MedicoFilter as Filter } from "../services"
import { medicoPolicy } from "../policies"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

type Inputs = {
  numCi?: string
  compCi?: string
  nombre?: string
  especialidad?: string
  regional: Regional[]
  estado?: 1 | 2 | ""
}

type Props = {
  onFilter: (filter: Filter) => void
}

const schema = yup.object().shape({
  numCi: yup.number().nonEmpty().nullable().when("compCi", {
    is: true,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.optional()
  }),
  compCi: yup.string().nonEmpty().uppercase().optional(),
  nombre: yup.string().nonEmpty().uppercase().optional(),
  especialidad: yup.string().nonEmpty().uppercase().optional(),
  estado: yup.number().nonEmpty().optional()
})

export const MedicosFilterForm = (props: Props) => {
  const {
    control,
    formState,
    handleSubmit,
    register,
    reset
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      regional: [],
      estado: ""
    }
  })

  const user = useUser()

  if(!user) return null
  
  return <Form className="p-2 border rounded" onSubmit={handleSubmit((data) => {
    const filter: Filter = {}
    if(data.numCi) {
      filter.ci = {
        raiz: parseInt(data.numCi)
      }
      if(data.compCi) filter.ci!.complemento = data.compCi
    }
    if(data.especialidad) filter.especialidad = data.especialidad
    if(data.regional.length) filter.regionalId = data.regional[0].id
    if(data.estado) filter.estado = data.estado
    props.onFilter(filter)
  })}>
    <Form.Row>
      <Form.Group as={Col} sm={6} lg={4} xl={3}>
        <fieldset className="border rounded" style={{padding: 5, paddingTop: 0, marginBottom: -6}}>
          <Form.Label as="legend" style={{width: "auto", fontSize:"1rem"}}>Carnet de identidad</Form.Label>
          <Form.Row>
            <Col xs={9}>
              <Form.Control
                aria-label="Número raiz"
                className="text-uppercase"
                isInvalid={!!formState.errors.numCi}
                {...register("numCi")}
              />
              <Form.Control.Feedback type="invalid">{formState.errors.numCi?.message}</Form.Control.Feedback>
            </Col>
            <Col xs={3}>
              <Form.Control
                aria-label="Número complemento"
                className="text-uppercase"
                {...register("compCi")}
              />
            </Col>
          </Form.Row>
        </fieldset>
      </Form.Group>
      <Form.Group as={Col} sm={6} lg={4} xl={3}>
        <Form.Label>Regional</Form.Label>
        <Controller
          control={control}
          name="regional"
          render={({field: {ref, value, ...field}, fieldState})=>{
            return <RegionalesTypeahead
              className="text-uppercase"
              id="medico-filter-regional"
              selected={medicoPolicy.viewByRegionalOnly(user) ? [user.regional as Regional] : value}
              {...field}
            />
          }}
        />
      </Form.Group>
      <Form.Group as={Col} lg={4} xl={3}>
        <Form.Label>Especialidad</Form.Label>
        <Form.Control
          className="text-uppercase"
          {...register("especialidad")}
        />
      </Form.Group>
      <Form.Group as={Col} lg={4} xl={3}>
        <fieldset className="border rounded" style={{padding: 5, paddingTop: 0, marginBottom: -6}}>
          <Form.Label as="legend" style={{width: "auto", fontSize:"1rem"}}>Estado</Form.Label>
          <Controller
            control={control}
            name="estado"
            render={({field: {value, ...field}})=>{
              console.log(value)
              return <Form.Row>
                <Col>
                  <Form.Check
                    style={{
                      height: "calc(1.5em + 0.75rem + 2px)",
                      paddingTop: "0.375rem",
                      paddingBottom: "0.375rem"
                    }}
                    type="radio"
                    label="Activos"
                    value={1}
                    checked={value == 1}
                    {...field}
                  />
                </Col>
                <Col>
                  <Form.Check
                    style={{
                      height: "calc(1.5em + 0.75rem + 2px)",
                      paddingTop: "0.375rem",
                      paddingBottom: "0.375rem"
                    }}
                    type="radio"
                    label="Bajas"
                    value={2}
                    checked={value == 2}
                    {...field}
                  />
                </Col>
                <Col>
                  <Form.Check
                    style={{
                      height: "calc(1.5em + 0.75rem + 2px)",
                      paddingTop: "0.375rem",
                      paddingBottom: "0.375rem"
                    }}
                    type="radio"
                    label="Todos"
                    value=""
                    checked={value === ""}
                    {...field}
                  />
                </Col>
              </Form.Row>
            }}
          />
        </fieldset>
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