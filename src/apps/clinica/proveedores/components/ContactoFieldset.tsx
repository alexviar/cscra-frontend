import {  Col, Form } from "react-bootstrap"
import { LatLngExpression } from "leaflet"
import { Controller, useFormContext } from "react-hook-form"
import * as yup from "yup"
import { LocationInput } from "../../../../commons/components"

export type Inputs = {
  direccion?: string,
  ubicacion?: LatLngExpression
  horario?: string, 
  telefono1?: number
  telefono2?: number | null
}

const schema = yup.object().shape({
  municipio: yup.array().label("municipio").length(1, "Debe indicar un municipio"),
  direccion: yup.string().label("dirección").trim().required(),
  ubicacion: yup.mixed().label("ubicación").required(),
  telefono1: yup.number().label("telefono 1").typeError("No es un numero válido")
    .emptyStringTo().required(),
  telefono2: yup.number().label("telefono 2")
    .emptyStringToNull()
    .typeError("No es un numero válido").nullable().notRequired()
})

export const ContactoFieldset = () => {

  const {
    register,
    control,
    formState
  } = useFormContext<Inputs>()
  // } = useFormContext<Inputs>({
  //   mode: "onBlur",
  //   resolver: yupResolver(schema),
  //   defaultValues: {
  //     ubicacion: [-17.78629, -63.18117]
  //   }
  // })

  const formErrors = formState.errors

  return <fieldset>
    <legend>Información de contacto</legend>
    <Form.Row>
      <Form.Group as={Col}>
        <Form.Label>Direccion</Form.Label>
        <Form.Control as="textarea"
          isInvalid={!!formErrors.direccion}
          {...register("direccion")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.direccion?.message}</Form.Control.Feedback>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col}>
        <Form.Label>Horario de atención</Form.Label>
        <Form.Control as="textarea"
          isInvalid={!!formErrors.horario}
          {...register("horario")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.horario?.message}</Form.Control.Feedback>
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
                isInvalid={!!fieldState.error}
                center={field.value || [-17.78629, -63.18117]}
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
        <Form.Control
          isInvalid={!!formErrors.telefono1}
          {...register("telefono1")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.telefono1?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} sm={4}>
        <Form.Label>Teléfono 2</Form.Label>
        <Form.Control
          isInvalid={!!formErrors.telefono2}
          {...register("telefono2")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.telefono2?.message}</Form.Control.Feedback>
      </Form.Group>
    </Form.Row>
  </fieldset>
}