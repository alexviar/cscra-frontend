import { Form, Col } from "react-bootstrap"
import { Controller, useFormContext } from "react-hook-form"
import { useParams } from "react-router"
import { Regional, RegionalesTypeahead, LazyControl } from '../../../../commons/components'
import { useUser } from '../../../../commons/auth'
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
        <LazyControl
          id="proveedor-nit"
          initialized={initialized}
          className="text-uppercase"
          isInvalid={!!formErrors.nit}
          {...register("nit")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.nit?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} sm={8}>
        <Form.Label htmlFor="proveedor-nombre">Nombre</Form.Label>
        <LazyControl
          id="proveedor-nombre"
          initialized={initialized}
          className="text-uppercase"
          isInvalid={!!formErrors.nombre}
          {...register("nombre")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.nombre?.message}</Form.Control.Feedback>
      </Form.Group>      
      <Form.Group as={Col} md={4}>
          <Form.Label htmlFor="proveedor-form/regionales-typeahead">Regional</Form.Label>
          <Controller
            name="regional"
            control={control}
            render={({field, fieldState})=>{
              return <>
                <RegionalesTypeahead
                  id="proveedor-form/regionales-typeahead"
                  initialized={initialized}
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
          />
        </Form.Group>
      
    </Form.Row>
  </>
}