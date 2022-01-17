import { AxiosError, AxiosResponse } from 'axios'
import { useEffect, useState, useRef } from 'react'
import { Alert, Button, Col, Form, InputGroup, Modal, Spinner } from 'react-bootstrap'
import { Controller, useFormContext } from 'react-hook-form'
import { useParams } from 'react-router'
import * as yup from 'yup'
import { Regional, RegionalesTypeahead } from '../../../../commons/components'
import { Permisos, useUser } from '../../../../commons/auth'
import { Proveedor } from '../services'

export type Inputs = {
  tipo?: 1
  nit?: string
  ci?: number
  ciComplemento?: string
  apellidoPaterno?: string
  apellidoMaterno?: string
  nombre?: string
  especialidad?: string
  regional?: Regional[]
}

type Props = {
  proveedor?: Proveedor,
  onSubmit?: (data: Inputs) => void
}

const schema = yup.object().shape({
  nit: yup.string().label("NIT")
    .trim()
    .matches(/^[0-9]*$/, "Este campo solo admite números")
    .nullable()
    .notRequired(),
  ci: yup.number().label("número de carnet")
    .emptyStringToNull()
    .typeError("El ${path} no es un numero valido")
    .nullable()
    .required(),
  ciComplemento: yup.string().transform(value => value === "" ? null : value).trim().uppercase().nullable().notRequired()
    .length(2).matches(/[0-1A-Z]/),
  apellidoPaterno: yup.string().label("apellido paterno").trim().when("apellidoMaterno", {
    is: (apellidoMaterno: string) => !apellidoMaterno,
    then: yup.string().required("Debe proporcionar al menos un apellido").max(50)
  }),
  apellidoMaterno: yup.string().label("apellido materno").trim().when("apellidoPaterno", {
    is: (apellidoPaterno: string) => !apellidoPaterno,
    then: yup.string().required("Debe proporcionar al menos un apellido").max(50)
  }),
  nombres: yup.string().label("nombres").trim().required().label("'Nombres'").max(50),
  especialidad: yup.array().length(1, "Debe indicar una especialidad"),
  regional: yup.array().length(1, "Debe indicar una regional")
}, [["apellidoMaterno", "apellidoPaterno"]])


export const ProveedorMedicoFieldset = ()=>{

  const {id} = useParams<{
    id?: string
  }>()

  const loggedUser = useUser()

  const {
    register,
    control,
    formState,
    watch
  } = useFormContext<Inputs>()

  const formErrors = formState.errors

  return <>
    <Form.Row>
      <Form.Group as={Col} md={4} xs={8}>
        <Form.Label>NIT</Form.Label>
        <Form.Control
          isInvalid={!!formErrors.nit}
          {...register("nit")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.nit?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} md={4} xs={8}>
        <Form.Label>Carnet de identidad</Form.Label>
        <Form.Control
          isInvalid={!!formErrors.ci}
          {...register("ci")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.ci?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} md={2} xs={4}>
        <Form.Label>Complemento</Form.Label>
        <Form.Control
          isInvalid={!!formErrors.ciComplemento}
          {...register("ciComplemento")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.ciComplemento?.message}</Form.Control.Feedback>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} md={4}>
        <Form.Label>Apellido Paterno</Form.Label>
        <Form.Control
          isInvalid={!!formErrors.apellidoPaterno}
          {...register("apellidoPaterno")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.apellidoPaterno?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} md={4}>
        <Form.Label>Apellido Materno</Form.Label>
        <Form.Control
          isInvalid={!!formErrors.apellidoMaterno}
          {...register("apellidoMaterno")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.apellidoMaterno?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} md={4}>
        <Form.Label>Nombres</Form.Label>
        <Form.Control
          isInvalid={!!formErrors.nombre}
          {...register("nombre")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.nombre?.message}</Form.Control.Feedback>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} md={8}>
        <Form.Label htmlFor="medico-especialidad">Especialidad</Form.Label>
        <Form.Control id="medico-especialidad"
          {...register("especialidad")}
        />
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
                filterBy={(regional) => {
                  if(id){
                    if(loggedUser?.can(Permisos.EDITAR_PROVEEDORES_REGIONAL) && loggedUser?.regionalId == regional.id) return true
                    if(loggedUser?.can(Permisos.EDITAR_PROVEEDORES)) return true
                  }
                  else{
                    if(loggedUser?.can(Permisos.REGISTRAR_PROVEEDORES_REGIONAL) && loggedUser?.regionalId == regional.id) return true
                    if(loggedUser?.can(Permisos.REGISTRAR_PROVEEDORES)) return true
                  }
                  return false
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