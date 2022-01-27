import { useEffect, useState } from "react"
import { Button, Form, Col, Spinner } from "react-bootstrap"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
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

export const ProveedorEmpresaFieldset = ()=>{

  const { id } = useParams<{id: string}>()

  const {
    control,
    formState,
    register,
    watch
  } = useFormContext<Inputs>()

  const user = useUser()

  const formErrors = formState.errors
  const initialized = watch("initialized")

  return <>
    <Form.Row>
      <Form.Group as={Col} sm={4}>
        <Form.Label htmlFor="proveedor-nit">NIT</Form.Label>
        {initialized ? <Form.Control
          id="proveedor-nit"
          className="text-uppercase"
          isInvalid={!!formErrors.nit}
          {...register("nit")}
        /> : <Skeleton />}
        <Form.Control.Feedback type="invalid">{formErrors.nit?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} sm={8}>
        <Form.Label htmlFor="proveedor-nombre">Nombre</Form.Label>
        {initialized ? <Form.Control
          id="proveedor-nombre"
          className="text-uppercase"
          isInvalid={!!formErrors.nombre}
          {...register("nombre")}
        /> : <Skeleton />}
        <Form.Control.Feedback type="invalid">{formErrors.nombre?.message}</Form.Control.Feedback>
      </Form.Group>      
      <Form.Group as={Col} md={4}>
          <Form.Label htmlFor="proveedor-form/regionales-typeahead">Regional</Form.Label>
          {initialized ? <Controller
            name="regional"
            control={control}
            render={({field, fieldState})=>{
              return <>
                <RegionalesTypeahead
                  id="proveedor-form/regionales-typeahead"
                  className="text-uppercase"
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