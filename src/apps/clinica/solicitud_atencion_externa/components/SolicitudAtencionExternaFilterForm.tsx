import React from "react"
import { Button, Col, Form } from 'react-bootstrap'
import { useForm, Controller }  from 'react-hook-form'
import { Medico, MedicosTypeahead } from "../../medicos/components"
import { Proveedor, ProveedoresTypeahead } from "../../proveedores/components"
import { Regional, RegionalesTypeahead } from "../../../../commons/components"
import { useUser } from "../../../../commons/auth/hooks"
import { SolicitudesAtencionExternaFilter } from "../services/SolicitudesAtencionExternaService"
import moment from "moment"
import { solicitudAtencionExternaPolicy } from "../policies"
import { medicoPolicy } from "../../medicos"
import { proveedorPolicy } from "../../proveedores"

type Inputs = {
  numero: string
  desde: string
  hasta: string
  numeroPatronal: string
  matricula: string
  medico: Medico[]
  proveedor: Proveedor[]
  regional: Regional[]
}

type Props = {
  onFilter: (filter: SolicitudesAtencionExternaFilter)=>void
}
export const SolicitudAtencionExternaFilterForm = (props: Props)=>{

  const user = useUser()

  const {
    control,
    formState,
    handleSubmit,
    register,
    reset,
    watch
  } = useForm<Inputs>({
    defaultValues: {
      medico: [],
      proveedor: [],
      regional: []
    }
  })
  
  return <Form className="p-2 border rounded" onSubmit={handleSubmit((input)=>{
    const filter: SolicitudesAtencionExternaFilter = {}
    
    props.onFilter({
      numeroPatronal: input.numeroPatronal,
      matricula: input.matricula,
      desde: input.desde && moment(input.desde).format("YYYY-MM-DD"),
      hasta: input.hasta && moment(input.hasta).format("YYYY-MM-DD"),
      medicoId: input.medico.length && input.medico[0].id,
      proveedorId: input.medico.length ? input.proveedor[0].id : undefined,
      regionalId: input.regional.length && input.regional[0].id
    })
  })}>
    <Form.Row>
      <Form.Group as={Col} xs={6} md={4} xl={2}>
        <Form.Label>Nº Patronal</Form.Label>
        <Form.Control {...register("numeroPatronal")} />
      </Form.Group>
      <Form.Group as={Col} xs={6} md={4} xl={2}>
        <Form.Label>Matricula</Form.Label>
        <Form.Control {...register("matricula")} />
      </Form.Group>
      <Form.Group as={Col} md={4} xl={2}>
        <Form.Label>Regional</Form.Label>
        <Controller
          control={control}
          name="regional"
          render={({field: {ref, value, ...field}})=>{
            return <RegionalesTypeahead
              className="text-uppercase"
              id="medico-filter-regional"
              selected={solicitudAtencionExternaPolicy.viewByRegionalOnly(user) ? [user!.regional as Regional] : value}
              filterBy={(regional) => solicitudAtencionExternaPolicy.viewByRegionalOnly(user, {regionalId: regional.id}) !== false}
              {...field}
            />
          }}
        />
      </Form.Group>
      <Form.Group as={Col} md={6}>
        <Form.Label>Médico</Form.Label>
        <Controller
          control={control}
          name="medico"
          render={({field})=>{
            return <MedicosTypeahead
              id="medicos-typeahead"
              filter={{
                regionalId: medicoPolicy.viewByRegionalOnly(user) ? user!.regionalId : watch("regional").length && watch("regional")[0].id
              }}
            />
          }}
        />
      </Form.Group>
      <Form.Group as={Col} md={6}>
        <Form.Label>Proveedor</Form.Label>
        <Controller
          control={control}
          name="medico"
          render={()=>{
            return <ProveedoresTypeahead
              id="proveedores-typeahead"
              filter={{
                regionalId: proveedorPolicy.viewByRegionalOnly(user) ? user!.regionalId : watch("regional").length && watch("regional")[0].id
              }}
            />
          }}
        />
      </Form.Group>
      <Form.Group as={Col} xs={6} md={4} xl={2}>
        <Form.Label>Desde</Form.Label>
        <Form.Control
          type="date"
          {...register("desde")}
        />
      </Form.Group>
      <Form.Group as={Col} xs={6} md={4} xl={2}>
        <Form.Label>Hasta</Form.Label>
        <Form.Control
          type="date"
          {...register("hasta")}
        />
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Col xs="auto" className="ml-auto">
        <Button type="submit">Aplicar</Button>
      </Col>
      <Col xs="auto">
        <Button variant="secondary" onClick={()=>reset()}>Limpiar</Button>
      </Col>
    </Form.Row>
  </Form>
}