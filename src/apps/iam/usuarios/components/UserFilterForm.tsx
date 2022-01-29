import { Button, Col, Form } from "react-bootstrap"
import { Controller, useForm } from "react-hook-form"
import { Regional, RegionalesTypeahead } from "../../../../commons/components"
import { useUser } from "../../../../commons/auth/hooks"
import { UserFilter as Filter } from "../services"
import { usuarioPolicy as userPolicy } from "../policies"
import * as yup from "yup"

type Inputs = {
  numCi: number
  compCi: string
  estado: number
  regional: Regional[]
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
  regional: yup.mixed().optional(),
  estado: yup.number().nonEmpty().optional()
})

export const UserFilterForm = (props: Props) => {

  const user = useUser()

  const {
    control,
    formState,
    handleSubmit,
    register,
    reset
  } = useForm<Inputs>({
    defaultValues: {
      regional: userPolicy.viewByRegionalOnly(user) ? [user!.regional] : [],
      estado: 0
    }
  })

  return <Form className="border rounded p-2" onSubmit={handleSubmit((data) => {
    const filter: Filter = {}
    filter.ci = data.numCi ? {
      raiz: data.numCi,
      complemento: data.compCi ? data.compCi : undefined
    } : undefined
    filter.regionalId = data.regional.length && data.regional[0].id
    filter.estado = data.estado
    props.onFilter(filter)
  })}>
    <Form.Row>
      <Form.Group as={Col} md={6} lg={4}>
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
      <Form.Group as={Col} md={6} lg={4}>
        <Form.Label>Regional</Form.Label>
        <Controller
          control={control}
          name="regional"
          render={({field: {ref, value, ...field}, fieldState})=>{
            return <RegionalesTypeahead
              className="text-uppercase"
              id="medico-filter-regional"
              selected={userPolicy.viewByRegionalOnly(user) ? [user!.regional as Regional] : value}
              filterBy={(regional) => userPolicy.viewByRegionalOnly(user, {regionalId: regional.id}) !== false}
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
    </Form.Row>
    <Form.Row>
      <Col className="ml-auto" xs="auto">
        <Button type="submit">Aplicar</Button>
      </Col>
      <Col xs="auto">
        <Button variant="secondary" onClick={()=>reset({
          regional: userPolicy.viewByRegionalOnly(user) ? [user!.regional] : [],
          estado: 0
        })}>Limpiar</Button>
      </Col>
    </Form.Row>
  </Form>
}