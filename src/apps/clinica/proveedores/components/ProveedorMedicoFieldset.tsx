import {  Col, Form } from 'react-bootstrap'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Controller, useFormContext } from 'react-hook-form'
import { useParams } from 'react-router'
import { Regional, RegionalesTypeahead } from '../../../../commons/components'
import { useUser } from '../../../../commons/auth'
import { proveedorPolicy } from '../policies'

export type Inputs = {
  initialized: boolean
  tipo?: 1
  nit?: string
  ci?: number
  ciComplemento?: string | null
  apellidoPaterno?: string | null
  apellidoMaterno?: string | null
  nombre?: string
  especialidad?: string
  regional?: Regional[]
}

export const ProveedorMedicoFieldset = ()=>{

  const {id} = useParams<{
    id?: string
  }>()

  const user = useUser()

  const {
    register,
    control,
    formState,
    watch
  } = useFormContext<Inputs>()

  const formErrors = formState.errors

  const initialized = watch("initialized")

  return <>
    <Form.Row>
      <Form.Group as={Col} xs={12} sm={6} md={4}>
        <Form.Label htmlFor="nit">NIT</Form.Label>
        {initialized ? <Form.Control
          isInvalid={!!formErrors.nit}
          {...register("nit")}
        /> : <Skeleton />}
        <Form.Control.Feedback type="invalid">{formErrors.nit?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} xs={12} sm={6} md={4}>
        <fieldset className={`border${formState.errors.ci || formState.errors.ciComplemento ? " border-danger " : " "}rounded`}
          style={{padding: 5, paddingTop: 0, marginBottom: -6, marginLeft: -5, marginRight: -5}}>
          <Form.Label as="legend" style={{width: "auto", fontSize:"1rem"}}>Carnet de identidad</Form.Label>
          <Form.Row>
            <Col xs={8}>
              {initialized ? <Form.Control
                aria-label="Número raiz"
                className="text-uppercase"
                isInvalid={!!formState.errors.ci}
                {...register("ci")}
              /> : <Skeleton />}
              <Form.Control.Feedback type="invalid">{formState.errors.ci?.message}</Form.Control.Feedback>
            </Col>
            <Col xs={4}>
              {initialized ? <Form.Control
                aria-label="Número complemento"
                className="text-uppercase"
                isInvalid={!!formState.errors.ciComplemento}
                {...register("ciComplemento")}
              /> : <Skeleton />}
              <Form.Control.Feedback type="invalid">{formState.errors.ciComplemento?.message}</Form.Control.Feedback>
            </Col>
          </Form.Row>
        </fieldset>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} md={4}>
        <Form.Label>Apellido Paterno</Form.Label>
        {initialized ? <Form.Control
          isInvalid={!!formErrors.apellidoPaterno}
          {...register("apellidoPaterno")}
        /> : <Skeleton />}
        <Form.Control.Feedback type="invalid">{formErrors.apellidoPaterno?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} md={4}>
        <Form.Label>Apellido Materno</Form.Label>
        {initialized ? <Form.Control
          isInvalid={!!formErrors.apellidoMaterno}
          {...register("apellidoMaterno")}
        /> : <Skeleton />}
        <Form.Control.Feedback type="invalid">{formErrors.apellidoMaterno?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} md={4}>
        <Form.Label>Nombres</Form.Label>
        {initialized ? <Form.Control
          isInvalid={!!formErrors.nombre}
          {...register("nombre")}
        /> : <Skeleton />}
        <Form.Control.Feedback type="invalid">{formErrors.nombre?.message}</Form.Control.Feedback>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} md={4}>
        <Form.Label htmlFor="medico-especialidad">Especialidad</Form.Label>
        {initialized ? <Form.Control id="medico-especialidad"
          isInvalid={!!formErrors.especialidad}
          {...register("especialidad")}
        /> : <Skeleton />}
        <Form.Control.Feedback type="invalid">{formErrors.especialidad?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} md={4}>
        <Form.Label>Regional</Form.Label>
        {initialized ? <Controller
          name="regional"
          control={control}
          render={({field, fieldState})=>{
            return <>
              <RegionalesTypeahead
                id="proveedor-form/regionales-typeahead"
                filterBy={(regional) => {
                  if(id){
                    return proveedorPolicy.editByRegionalOnly(user, {regionalId: regional.id}) !== false
                  }
                  else{
                    return proveedorPolicy.registerByRegionalOnly(user, {regionalId: regional.id}) !== false
                  }
                }}
                feedback={fieldState.error?.message}
                isInvalid={!!fieldState.error}
                selected={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            </>
          }}
        /> : <Skeleton />}
      </Form.Group>
    </Form.Row>
  </>
}