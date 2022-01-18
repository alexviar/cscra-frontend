import { useEffect, useState } from "react"
import { Button, Form, Col, Spinner } from "react-bootstrap"
import { Controller, useForm, useFormContext } from "react-hook-form"
import { useParams, useHistory } from "react-router"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Regional, RegionalesTypeahead } from '../../../../commons/components'
import { Permisos, useUser } from '../../../../commons/auth'
import { Proveedor, ProveedoresService } from '../services'
import { proveedorPolicy } from "../policies"

export type Inputs = {
  initialized: boolean
  tipo: 2
  nit?: string,
  ci?: never
  ciComplemento?: never
  apellidoPaterno?: never
  apellidoMaterno?: never
  nombre?: string
  especialidad?: never
  regional?: Regional[]
}

const schema = yup.object().shape({
  nit: yup.string().label("NIT")
  .trim()
  .matches(/^[0-9]*$/, "Este campo solo admite números")
  .required(),
  // .nullable()
  // .notRequired('),
  nombre: yup.string().trim().required().max(150),  
  regional: yup.array().length(1, "Debe indicar una regional")
})

export const ProveedorEmpresaFieldset = ()=>{

  const { id } = useParams<{id: string}>()

  const {
    control,
    formState,
    register
  } = useFormContext<Inputs>()

  const user = useUser()

  const formErrors = formState.errors

  return <>
    <Form.Row>
      <Form.Group as={Col} sm={4}>
        <Form.Label>NIT</Form.Label>
        <Form.Control
          isInvalid={!!formErrors.nit}
          {...register("nit")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.nit?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} sm={8}>
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          isInvalid={!!formErrors.nombre}
          {...register("nombre")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.nombre?.message}</Form.Control.Feedback>
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