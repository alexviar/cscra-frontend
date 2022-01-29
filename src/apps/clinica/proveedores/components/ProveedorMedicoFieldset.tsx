import {  Col, Form } from 'react-bootstrap'
import { Controller, useFormContext } from 'react-hook-form'
import { useParams } from 'react-router'
import { Regional, RegionalesTypeahead, LazyControl } from '../../../../commons/components'
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
        <LazyControl
          isInvalid={!!formErrors.nit}
          className="text-uppercase"
          initialized={initialized}
          {...register("nit")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.nit?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} xs={12} sm={6} md={4}>
        <fieldset className={`border${formState.errors.ci || formState.errors.ciComplemento ? " border-danger " : " "}rounded`}
          style={{padding: 5, paddingTop: 0, marginBottom: -6}}>
          <Form.Label as="legend" style={{width: "auto", fontSize:"1rem"}}>Carnet de identidad</Form.Label>
          <Form.Row>
            <Col xs={8}>
              <LazyControl
                aria-label="Número raiz"
                className="text-uppercase"
                isInvalid={!!formState.errors.ci}
                initialized={initialized}
                {...register("ci")}
              />
              <Form.Control.Feedback type="invalid">{formState.errors.ci?.message}</Form.Control.Feedback>
            </Col>
            <Col xs={4}>
              <LazyControl
                aria-label="Número complemento"
                className="text-uppercase"
                initialized={initialized}
                isInvalid={!!formState.errors.ciComplemento}
                {...register("ciComplemento")}
              />
              <Form.Control.Feedback type="invalid">{formState.errors.ciComplemento?.message}</Form.Control.Feedback>
            </Col>
          </Form.Row>
        </fieldset>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} md={4}>
        <Form.Label>Apellido Paterno</Form.Label>
        <LazyControl
          isInvalid={!!formErrors.apellidoPaterno}
          className="text-uppercase"
          initialized={initialized}
          {...register("apellidoPaterno")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.apellidoPaterno?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} md={4}>
        <Form.Label>Apellido Materno</Form.Label>
        <LazyControl
          isInvalid={!!formErrors.apellidoMaterno}
          className="text-uppercase"
          initialized={initialized}
          {...register("apellidoMaterno")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.apellidoMaterno?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} md={4}>
        <Form.Label>Nombres</Form.Label>
        <LazyControl
          isInvalid={!!formErrors.nombre}
          className="text-uppercase"
          initialized={initialized}
          {...register("nombre")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.nombre?.message}</Form.Control.Feedback>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} md={4}>
        <Form.Label htmlFor="medico-especialidad">Especialidad</Form.Label>
        <LazyControl id="medico-especialidad"
          isInvalid={!!formErrors.especialidad}
          className="text-uppercase"
          initialized={initialized}
          {...register("especialidad")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.especialidad?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} md={4}>
        <Form.Label>Regional</Form.Label>
        <Controller
          name="regional"
          control={control}
          render={({field, fieldState})=>{
            return <>
              <RegionalesTypeahead
                id="proveedor-form/regionales-typeahead"
                className="text-uppercase"
                initialized={initialized}
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
        />
      </Form.Group>
    </Form.Row>
  </>
}