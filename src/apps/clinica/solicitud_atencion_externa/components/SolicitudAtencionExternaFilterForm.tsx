import React from "react"
import { Button, Col, Form } from 'react-bootstrap'
import { useForm, Controller }  from 'react-hook-form'
import { SolicitudesAtencionExternaFilter } from "../services/SolicitudesAtencionExternaService"
import { Medico, MedicosTypeahead } from "./MedicosTypeahead"
import { Proveedor, ProveedoresTypeahead } from "./ProveedoresTypeahead"

type Inputs = {
  numero: string
  desde: string
  hasta: string
  numeroPatronal: string,
  matricula: string,
  medico: Medico[]
  proveedor: Proveedor[]
}

type Props = {
  onFilter: (filter: SolicitudesAtencionExternaFilter)=>void
}
export const SolicitudAtencionExternaFilterForm = (props: Props)=>{
  const {
    control,
    formState,
    handleSubmit,
    register
  } = useForm<Inputs>({
    defaultValues: {
      medico: [],
      proveedor: []
    }
  })
  console.log(formState)
  return <Form className={"mb-2"} onSubmit={handleSubmit((input)=>{
    const filter: SolicitudesAtencionExternaFilter = {}
    props.onFilter({
      numero: parseInt(input.numero),
      numeroPatronal: input.numeroPatronal,
      matriculaAsegurado: input.matricula,
      desde: input.desde,
      hasta: input.hasta,
      medicoId: input.medico.length && input.medico[0].id,
      proveedorId: input.proveedor.length && input.proveedor[0].id
    })
  })}>
    <Form.Row>
      <Form.Group as={Col}>
        <Form.Label>Número de solicitud</Form.Label>
        <Form.Control {...register("numero")}/>
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>Nº Patronal</Form.Label>
        <Form.Control {...register("numeroPatronal")} />
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>Matricula</Form.Label>
        <Form.Control {...register("matricula")} />
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col}>
        <Form.Label>Médico</Form.Label>
        <Controller
          control={control}
          name="medico"
          render={({field})=>{
            return <MedicosTypeahead
              id="solicitud-atencion-externa-filter/medicos"
              selected={field.value}
              onBlur={field.onBlur}
              onChange={field.onChange}
            />
          }}
        />
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>Proveedor</Form.Label>
        <Controller
          control={control}
          name="proveedor"
          render={({field})=>{
            return <ProveedoresTypeahead
              id="solicitud-atencion-externa-filter/proveedores"
              selected={field.value}
              onBlur={field.onBlur}
              onChange={field.onChange}
            />
          }}
        />
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} sm={4}>
          <Form.Label>Desde</Form.Label>
          <Form.Control
            type="date"
            {...register("desde")}
          />
        </Form.Group>
        <Form.Group as={Col} sm={4}>
          <Form.Label>Hasta</Form.Label>
          <Form.Control
            type="date"
            {...register("hasta")}
          />
        </Form.Group>
    </Form.Row>
    <Form.Row>
      <Col xs="auto">
        <Button type="submit">Aplicar</Button>
      </Col>
      <Col xs="auto">
        <Button type="reset" variant="secondary">Limpiar</Button>
      </Col>
    </Form.Row>
  </Form>
}