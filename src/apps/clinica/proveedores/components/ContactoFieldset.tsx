import { useMemo } from "react"
import {  Col, Form } from "react-bootstrap"
import { LatLngExpression } from "leaflet"
import { Controller, useFormContext } from "react-hook-form"
import { Regional, LazyControl, LocationInput } from "../../../../commons/components"
import { useUser } from "../../../../commons/auth"

export type Inputs = {
  initialized: boolean
  regional: Regional[]
  direccion?: string
  ubicacion?: LatLngExpression | null
  horario?: string, 
  telefono1?: number
  telefono2?: number | null
}

export const ContactoFieldset = () => {

  const user = useUser()

  const {
    register,
    control,
    formState,
    watch
  } = useFormContext<Inputs>()

  const formErrors = formState.errors

  const initialized = watch("initialized")
  const regional = watch("regional")

  const center: [number, number] = useMemo(()=>{
    if(regional.length){
      return [
        regional[0].ubicacion.latitud,
        regional[0].ubicacion.longitud
      ]
    }
    return [
      (user!.regional as Regional).ubicacion.latitud,
      (user!.regional as Regional).ubicacion.longitud
    ]
  }, [user, regional.length])

  return <fieldset>
    <legend>Información de contacto</legend>
    <Form.Row>
      <Form.Group as={Col}>
        <Form.Label>Direccion</Form.Label>
        <LazyControl
          as="textarea"
          initialized={initialized}
          isInvalid={!!formErrors.direccion}
          className="text-uppercase"
          aria-describedby="direccionHelpBlock"
          {...register("direccion")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.direccion?.message}</Form.Control.Feedback>
        {!formErrors.direccion ? <Form.Text id="direccionHelpBlock" muted>{`${watch("direccion")!.length}/80` }</Form.Text> : null}
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col}>
        <Form.Label>Ubicación</Form.Label>
        <Controller
          name="ubicacion"
          control={control}
          render={({ field, fieldState }) => {
            return <>
              <LocationInput
                initialized={initialized}
                isInvalid={!!fieldState.error}
                center={field.value || center}
                value={field.value!}
                onChange={field.onChange}
              />
              <Form.Control.Feedback type="invalid">{fieldState.error?.message}</Form.Control.Feedback>
            </>
          }}
        />
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} sm={4}>
        <Form.Label>Teléfono 1</Form.Label>
        <LazyControl
          initialized={initialized}
          isInvalid={!!formErrors.telefono1}
          {...register("telefono1")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.telefono1?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} sm={4}>
        <Form.Label>Teléfono 2</Form.Label>
        <LazyControl
          initialized={initialized}
          isInvalid={!!formErrors.telefono2}
          {...register("telefono2")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.telefono2?.message}</Form.Control.Feedback>
      </Form.Group>
    </Form.Row>
  </fieldset>
}