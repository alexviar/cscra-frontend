import { useEffect, useState } from "react"
import { Alert, Button, Col, Form, Spinner } from "react-bootstrap"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { useParams, useHistory } from "react-router"
import { useMutation, useQueryClient } from "react-query"
import { AxiosError } from "axios"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { PrestacionesContratadasControl, Inputs as PCInputs } from "./PrestacionesContratadasControl"
// import { Regional, RegionalesTypeahead } from '../../../../commons/components'
import { Permisos, useLoggedUser } from "../../../../commons/auth"
import { ContratosService } from "../services"

export type Inputs = {
  inicio?: string
  fin?: string
  // regional?: Regional[]
} & PCInputs

type Props = {
  onSubmit?: (data: Inputs) => void
}

const schema = yup.object().shape({
  inicio: yup.date().label("fecha de inicio").emptyStringTo().typeError("No es una fecha valida")
    .required(),
  fin: yup.date().label("fecha de finalizacion").emptyStringTo(null).typeError("No es una fecha valida")
    .min(yup.ref("inicio"), "La fecha de finalizacion debe ser mayor a la fecha de inicio")
    .nullable().notRequired(),
  // regional: yup.array().length(1, "Debe seleccionar una regional"),
  prestaciones: yup.array().of(yup.object().shape({
    prestacion: yup.object().required()//array().length(1, "Debe seleccionar una prestacion")
  })).min(1, "Debe seleccionar al menos una prestación")
})

export const ContratoForm = ({onSubmit}: Props)=>{
  const {idProveedor} = useParams<{
    idProveedor: string
  }>()

  const history = useHistory<{
    tab: string
  }>()

  const loggedUser = useLoggedUser()
  
  // const [regionales, setRegionales] = useState<Regional[]>([])

  const methods = useForm<Inputs>({
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: {
      prestaciones: [],
    }
  })

  const {
    handleSubmit,
    register,
    formState,
    control,
    watch
  } = methods

  const formErrors = formState.errors

  console.log("Errors", formErrors)

  const queryClient = useQueryClient()

  const guardar = useMutation((values: Inputs)=>{
    return ContratosService.registrar(parseInt(idProveedor), {
      inicio: (values.inicio! as any).toISOString().split("T")[0],
      fin: (values.fin as any)?.toISOString().split("T")[0],
      prestacionIds: values.prestaciones.map(p=>p.prestacion.id)
    })
  }, {
    onSuccess: ({data}) => {
      queryClient.invalidateQueries("contratos.buscar")
      history.replace(`/clinica/proveedores/${parseInt(idProveedor)}`, {
        tab: "contratos"
      })
    }
  })

  return <FormProvider {...methods}>
    <Form id="proveedor-contrato-form" onSubmit={handleSubmit(onSubmit || ((values)=>{
      console.log("Values", values)
      guardar.mutate(values)
    }))}>
      <h1 style={{fontSize: "1.75rem"}}>Contrato</h1>
      {guardar.status == "error" || guardar.status == "success"  ? <Alert variant={guardar.isError ? "danger" : "success"}>
      {guardar.isError ? (guardar.error as AxiosError).response?.data?.message || (guardar.error as AxiosError).message : "Guardado"}
      </Alert> : null}
      <Form.Row>
        <Form.Group as={Col} sm={6}>
          <Form.Label>Inicio</Form.Label>
          <Form.Control type="date"
            isInvalid={!!formState.errors.inicio}
            {...register("inicio")}
          />
          <Form.Control.Feedback type="invalid">{formState.errors.inicio?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} sm={6}>
          <Form.Label>Fin</Form.Label>
          <Form.Control type="date"
            isInvalid={!!formState.errors.fin}
            {...register("fin")}
          />
          <Form.Control.Feedback type="invalid">{formState.errors.fin?.message}</Form.Control.Feedback>
        </Form.Group>
      </Form.Row>
      {/* <Form.Row>
        <Form.Group as={Col} md={4}>
          <Form.Label>Regional</Form.Label>
          <Controller
            name="regional"
            control={control}
            render={({field, fieldState})=>{
              return <>
                <RegionalesTypeahead
                  id="proveedor-contrato-form/regionales-typeahead"
                  onLoad={(regionales)=>setRegionales(regionales)}
                  filterBy={(regional) => {
                    if(idProveedor){
                      if(loggedUser.can(Permisos.REGISTRAR_CONTRATO_PROVEEDOR) 
                        || (loggedUser.can(Permisos.REGISTRAR_CONTRATO_PROVEEDOR_REGIONAL) && loggedUser.regionalId == regional.id)) return true
                    }
                    else{
                      if(loggedUser.can(Permisos.REGISTRAR_PROVEEDORES) 
                        || (loggedUser.can(Permisos.REGISTRAR_PROVEEDORES_REGIONAL) && loggedUser.regionalId == regional.id)) return true
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
      </Form.Row> */}
      <Form.Row>
        <Col>
          <PrestacionesContratadasControl />
        </Col>
      </Form.Row>
      {!onSubmit ? <Button type="submit">
        {guardar.isLoading ? <Spinner className="mr-1" animation="border" size="sm"/> : null}
        <span className="align-middle">Guardar</span>
      </Button> : null}
    </Form>
  </FormProvider>
}