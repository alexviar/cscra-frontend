import { Button, Col, Form } from "react-bootstrap"
import { useForm, Controller } from "react-hook-form"
import { Regional, RegionalesTypeahead } from "../../../../commons/components"
import { useUser } from "../../../../commons/auth/hooks"
import { Filter } from "../services"
import { proveedorPolicy } from "../policies"

type Inputs ={
  tipo: number
  regional: Regional[]
  estado: number
}

type Props = {
  onFilter: (filter: Filter) => void
}

export const ProveedoresFilterForm = (props: Props)=>{

  const user = useUser()

  const {
    control,
    handleSubmit,
    reset
  } = useForm<Inputs>({
    defaultValues: {
      regional: proveedorPolicy.viewByRegionalOnly(user) ? [user!.regional] : [],
      estado: 0,
      tipo: 0
    }
  })
  
  return <Form onSubmit={handleSubmit((data)=>{
    const filter: Filter = {}
    filter.regionalId = data.regional.length && data.regional[0].id
    filter.estado = data.estado
    filter.tipo = data.tipo
    props.onFilter(filter)
  })}>
    <Form.Row>
      <Form.Group as={Col} md={6} lg={4}>
        <Form.Label>Regional</Form.Label>
        <Controller
          control={control}
          name="regional"
          render={({field: {ref, value, ...field}, fieldState})=>{
            return <RegionalesTypeahead
              className="text-uppercase"
              id="medico-filter-regional"
              selected={proveedorPolicy.viewByRegionalOnly(user) ? [user!.regional as Regional] : value}
              filterBy={(regional) => proveedorPolicy.viewByRegionalOnly(user, {regionalId: regional.id}) !== false}
              {...field}
            />
          }}
        />
      </Form.Group>
      <Form.Group as={Col} md={6} lg={4}>
        <fieldset className="border rounded" style={{padding: 5, paddingTop: 0, marginBottom: -6}}>
          <Form.Label as="legend" style={{width: "auto", fontSize:"1rem"}}>Estado</Form.Label>
          <Controller
            control={control}
            name="estado"
            render={({field: {value, ...field}})=>{
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
                    label="Ambos"
                    value={0}
                    checked={value == 0}
                    {...field}
                  />
                </Col>
              </Form.Row>
            }}
          />
        </fieldset>
      </Form.Group>
      <Form.Group as={Col} md={6} lg={4}>
        <fieldset className="border rounded" style={{padding: 5, paddingTop: 0, marginBottom: -6}}>
          <Form.Label as="legend" style={{width: "auto", fontSize:"1rem"}}>Tipo</Form.Label>
          <Controller
            control={control}
            name="tipo"
            render={({field: {value, ...field}})=>{
              return <Form.Row>
                <Col>
                  <Form.Check
                    style={{
                      height: "calc(1.5em + 0.75rem + 2px)",
                      paddingTop: "0.375rem",
                      paddingBottom: "0.375rem"
                    }}
                    type="radio"
                    label="Medicos"
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
                    label="Empresas"
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
                    label="Ambos"
                    value={0}
                    checked={value == 0}
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
      <Col className="ml-auto" xs="auto">
        <Button type="submit">Aplicar</Button>
      </Col>
      <Col xs="auto">
        <Button variant="secondary" onClick={()=>reset({
          regional: proveedorPolicy.viewByRegionalOnly(user) ? [user!.regional] : [],
          estado: 0,
          tipo: 0
        })}>Limpiar</Button>
      </Col>
    </Form.Row>
  </Form>
}