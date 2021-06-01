import { useEffect, useState } from "react"
import { Button, Form, Col, Spinner } from "react-bootstrap"
import { Controller, useForm } from "react-hook-form"
import { useParams, useHistory } from "react-router"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useMutation, useQueryClient } from "react-query"
import { Regional, RegionalesTypeahead } from '../../../../commons/components'
import { Permisos, useLoggedUser } from '../../../../commons/auth'
import { Proveedor, ProveedoresService } from '../services'

export type Inputs = {
  tipo?: 2
  nit?: number,
  nombre?: string,
  regional?: Regional[]
}

type Props = {
  proveedor?: Proveedor,
  onSubmit?: (data: Inputs) => void
}

const schema = yup.object().shape({
  nit: yup.number().label("NIT")
  .emptyStringTo()
  .typeError("El ${path} no es un numero valido")
  .required(),
  // .nullable()
  // .notRequired(),
  nombre: yup.string().required().max(150),  
  regional: yup.array().length(1, "Debe indicar una regional")
})

export const ProveedorEmpresaForm = ({proveedor, onSubmit}: Props)=>{
  const {id} = useParams<{
    id?: string
  }>()

  const history = useHistory()

  const loggedUser = useLoggedUser()

  const {
    control,
    formState,
    handleSubmit,
    setValue,
    register
  } = useForm<Inputs>({
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: {
      tipo: 2,
      nit: proveedor?.nit as number,
      nombre: proveedor?.nombre as string,
      regional: []
    }
  })

  const formErrors = formState.errors

  const [ regionales, setRegionales ] = useState<Regional[]>([])

  const queryClient = useQueryClient()

  const guardar = useMutation((values: Inputs)=>{
    return ProveedoresService.actualizar(parseInt(id!), {
      tipoId: values.tipo!,
      nit: values.nit!,
      nombre: values.nombre!,
      regionalId: values.regional![0].id
    })
  }, {
    onSuccess: ({data}) => {
      queryClient.invalidateQueries("proveedor.buscar")
      history.replace(`/clinica/proveedores/${data.id}`)
    }
  })

  useEffect(()=>{
    if(proveedor && regionales.length){
      setValue("regional", regionales.filter(r=>r.id == proveedor.regionalId))
    }
  }, [proveedor, regionales])

  return <Form id="proveedor-form" onSubmit={handleSubmit(onSubmit || ((values)=>{
    guardar.mutate(values)
  }))}>
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
                  onLoad={(regionales)=>setRegionales(regionales)}
                  filterBy={(regional) => {
                    if(loggedUser.can(Permisos.REGISTRAR_PROVEEDORES)) return true 
                    if(loggedUser.can(Permisos.REGISTRAR_PROVEEDORES_REGIONAL) && loggedUser.regionalId == regional.id) return true
                    if(id && loggedUser.can(Permisos.EDITAR_PROVEEDORES)) return true
                    if(id && loggedUser.can(Permisos.EDITAR_PROVEEDORES_REGIONAL) && loggedUser.regionalId == regional.id) return true
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
    {!onSubmit ? <Button
        type="submit"
      >
        {guardar.isLoading ? <Spinner animation="border" size="sm" />: null}
        Guardar
      </Button> : null}
  </Form>
}