import { useEffect, useState } from "react"
import { Button, Form, Col, Spinner } from "react-bootstrap"
import { Controller, useForm } from "react-hook-form"
import { Redirect, useParams, useHistory } from "react-router"
import { useMutation } from "react-query"
import { RegionalesTypeahead } from "../../../../commons/components/RegionalesTypeahead"
import * as rules from '../../../../commons/components/rules'
import { Regional } from "../../../../commons/services/RegionalesService"
import { Proveedor, ProveedoresService } from '../services'

type Inputs = {
  nit: string,
  nombre: string,
  regional: Regional
}

type Props = {
  proveedor?: Proveedor,
  noRedirect?: boolean,
  next?: () => void
}

export const ProveedorEmpresaForm = ({proveedor, noRedirect=false, next}: Props)=>{
  const {id} = useParams<{
    id?: string
  }>()

  const history = useHistory<{
    proveedor?: Proveedor,
  }>()

  const [regionales, setRegionales] = useState<Regional[]>([])
  const {
    handleSubmit,
    register,
    control
  } = useForm<Inputs>()

  const guardar = useMutation((values: Inputs)=>{
    return id ? ProveedoresService.actualizar(parseInt(id), {
      tipoId: 2,
      nit: parseInt(values.nit) || undefined,
      nombre: values.nombre,
      regionalId: values.regional!.id
    }) : ProveedoresService.registrar({
      tipoId: 2,
      nit: parseInt(values.nit) || undefined,
      nombre: values.nombre,
      regionalId: values.regional!.id
    })
  })

  useEffect(()=>{
    if(guardar.data){
      if(next){
        history.replace(history.location.pathname, {
          proveedor: guardar.data.data
        })
        next()
      }
      else{
        history.replace(`/clinica/proveedores/${guardar.data.data.id}`)
      }
    }
  }, [guardar.data])

  return <Form onSubmit={handleSubmit((values)=>{
    guardar.mutate(values)
  })}>
    <Form.Row>
      <Form.Group as={Col} sm={4}>
        <Form.Label>NIT</Form.Label>
        <Form.Control
          // isInvalid={formState}
          {...register("nit", {
            pattern: rules.pattern(/\d*/)
          })}
        />
      </Form.Group>
      <Form.Group as={Col} sm={8}>
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          {...register("nombre", {
            required: rules.required()
          })}
        />
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} md={4}>
        <Form.Label>Regional</Form.Label>
        <Controller
          name="regional"
          control={control}
          rules={{
            required: rules.required()
          }}
          render={({field, fieldState})=>{
            return <>
              <RegionalesTypeahead
                id="medicos-form/regionales-typeahead"
                onLoad={(regionales)=>setRegionales(regionales)}
                className={fieldState.error ? "is-invalid" : ""}
                isInvalid={!!fieldState.error}
                selected={field.value ? [field.value] : []}
                onChange={(regionales)=>field.onChange(regionales.length && regionales[0])}
                onBlur={field.onBlur}
              />
              <Form.Control.Feedback type="invalid">{fieldState.error?.message}</Form.Control.Feedback>
            </>
          }}
        />
      </Form.Group>
    </Form.Row>
    <Button
      type="submit"
    >
      {guardar.isLoading ? <Spinner animation="border" size="sm" />: null}
      Guardar
    </Button>
  </Form>
}