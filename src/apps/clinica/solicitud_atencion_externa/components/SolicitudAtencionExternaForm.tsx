import { useEffect, useState } from "react"
import { AxiosError } from "axios"
import { Accordion, Alert, Button, Card,Col,Form, Spinner } from "react-bootstrap"
import { useForm, Controller, FormProvider } from "react-hook-form"
import moment from "moment"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { AseguradoCard, AseguradoInputs } from "./AseguradoCard"
import { PrestacionesSolicitadasInputs, PrestacionesSolicitadasCard } from "./PrestacionesSolicitadasCard"
import { useMutation } from "react-query"
import { Asegurado, SolicitudesAtencionExternaService } from "../services"
import { Regional, RegionalesTypeahead } from "../../../../commons/components"
import { useModal } from "../../../../commons/reusable-modal"
import { Permisos } from "../../../../commons/auth/constants"
import { useUser } from "../../../../commons/auth/hooks"
import { EstadosAfi, EstadosEmp } from "../utils"

type Inputs = AseguradoInputs & PrestacionesSolicitadasInputs & {
  regional: Regional[]
  medico: string
  especialidad: string
}

const hoy = moment()

const estadoAfiSchema = yup.string().label("estado").oneOf(Object.values(EstadosAfi), "Estado desconocido")
.test("estado-incoherente", "", function(value, context) {
  if(value == EstadosAfi[1] && context.parent.tieneBaja){
    return context.createError({
      message: "El asegurado figura como activo, pero hay un registro de su baja con fecha ${date}",
      params: {
        date: context.parent.fechaRegBaja
      }
    })
  }
  if(value == EstadosAfi[2] && !context.parent.tieneBaja){
    return context.createError({
      message: "El asegurado figura como dado de baja, aunque no se encontraron registros de la baja."
    })
  }
  return true
})

const validezSchema = yup.mixed().label("fecha de extinsion")
.test("min", "", function(value, context){
  const {estado, tieneBaja} = context.parent
  if(estado == EstadosAfi[2] && tieneBaja)
    if(!value) return context.createError({
      message: "Fecha sin especificar, se asume que el seguro ya no tiene validez"
    })
    if(moment(value).isSameOrBefore(hoy)) return context.createError({
      message: "El seguro ya no tiene validez"
    })
  return true
})

const schema = yup.object().shape({
  asegurado: yup.object().shape({
    matricula: yup.string().label("matricula").trim().uppercase().required().matches(/^\d{2}-\d{4}-[a-zA-ZñÑ]{2,3}$/, "Formato incorrecto."),
    estado: estadoAfiSchema,
    fechaExtincion: yup.lazy(value => value ? 
      yup.date().label("fecha de extinsion").nullable().notRequired().min(hoy.toDate(), "Fecha de extinsion alcanzada") :
      yup.mixed()),
    fechaValidezSeguro: validezSchema
  }),
  titular: yup.mixed().test("titular", "", (value, context) => {
    const asegurado = context.options.context?.asegurado
    if(asegurado?.tipo == 2 && asegurado?.afiliacion?.parentesco != 8) {
      if(!asegurado.titular){
        return context.createError({
          message: "No se encontraron datos del titular"
        })
      }
      try {
        yup.object().shape({
          estado: estadoAfiSchema,
          fechaValidezSeguro: validezSchema
        }).validateSync(value, {context: {asegurado: asegurado.titular}})
      } catch (e: any){
        return e
      }
    }
    return true
  }),
  empleador: yup.object().shape({
    numeroPatronal: yup.string().label("numero patronal").required(),
    estado: yup.string().label("estado").oneOf(Object.values(EstadosEmp), "Estado desconocido")
    .test("estado-incoherente", "El empleador figura como activo, pero tiene fecha de baja", function(value, context) {
      const empleador = context.options.context?.asegurado?.empleador
      return empleador.estado != 1 || !empleador.fechaBaja
    }),
    fechaBaja: yup.mixed().when("estado", {
      is: (estado: string) => estado == EstadosEmp[2] || estado == EstadosEmp[3],
      then: yup.date().required("Fecha sin especificar, se asume que el seguro ya no tiene validez")
               .min(hoy.subtract(2, "months").toDate())
    }),
    aportes: yup.lazy(value => value ? yup.string().oneOf(["No"], "El empleador esta en mora") : yup.string())
  }),
  regional: yup.array().length(1, "Debe seleccionar una regional"),
  medico: yup.string().trim().uppercase().required(),
  especialidad: yup.string().trim().uppercase().required(),
  proveedor: yup.string().trim().uppercase().required(),
  prestacionesSolicitadas: yup.array().of(yup.object().shape({
    prestacion: yup.string().trim().uppercase().required("Debe indicar una prestacion")
  })).min(1, "Debe solicitar un servicio").max(1, "Solo puede solicitar un servicio por solicitud")
})

export const SolicitudAtencionExternaForm = ()=>{
  const [asegurado, setAsegurado] = useState<Asegurado|null>(null)
  console.log("Asegurado", asegurado)
  const formMethods = useForm<Inputs>({
    mode: "onBlur",
    context: {
      asegurado
    },
    resolver: yupResolver(schema),
    defaultValues: {
      regional: [],
      medico: "",
      proveedor: "",
      prestacionesSolicitadas: [{
        id: 0,
        prestacion: ""
      }],
      asegurado: {},
      titular: {},
      empleador: {}
    }
  })
  const {
    register,
    handleSubmit,
    formState,
    control,
    reset,
    setValue,
    setError,
    watch
  } = formMethods

  const dm11Viewer = useModal("pdfModal")

  const user = useUser()
  
  const registrar = useMutation((values: Inputs)=>{
    return SolicitudesAtencionExternaService.registrar(
      values.regional![0].id,
      asegurado!.id,
      values.medico,
      values.especialidad,
      values.proveedor!,
      values.prestacionesSolicitadas.map(({prestacion})=>({prestacion}))
    )
  }, {
    onSuccess: ({data: {urlDm11, regionalId}}) => {
      if(user?.canAny([
        Permisos.EMITIR_SOLICITUDES_DE_ATENCION_EXTERNA,
        Permisos.EMITIR_SOLICITUDES_DE_ATENCION_EXTERNA_REGISTRADO_POR
      ]) || (user?.can(Permisos.EMITIR_SOLICITUDES_DE_ATENCION_EXTERNA_MISMA_REGIONAL) && regionalId == user?.regionalId)){
        dm11Viewer.open({url: urlDm11, title: "Formulario D.M. - 11"})
        reset()
      }
    }
  })

  const formErrors = formState.errors
  const registrarError = registrar.error as AxiosError

  useEffect(()=>{
    if(registrarError?.response?.status == 422){
      const {errors} = registrarError.response?.data
      Object.keys(errors).forEach((key: any)=>{
        let localKey = key
        if(key == "asegurado.id") localKey = "asegurado.matricula"
        setError(localKey, {type: "serverError", message: errors[key]})
      })
    }
  }, [registrarError])

  const renderAlert = ()=>{
    if(registrar.isSuccess){
      return <Alert variant="success">
      La operacion se realizó exitosamente
    </Alert>
    }
    if(registrar.isError){
      return registrarError.response?.status != 422 ? <Alert variant="danger">
        {registrarError ? registrarError.response?.data?.message || registrarError.message : ""}
      </Alert> : null
    }
    return null
  }

  return <FormProvider {...formMethods}>
    <Form onSubmit={handleSubmit((values)=>{
      registrar.mutate(values)
    })}>
      <h1 style={{fontSize: "1.75rem"}}>Solicitud de atención externa</h1>
      {renderAlert()}
      <Accordion className="mt-3"  defaultActiveKey="0">
        <AseguradoCard value={asegurado} onChange={(asegurado)=>{
          setAsegurado(asegurado)
        }} />
        <Card style={{overflow: "visible"}} >
          <Accordion.Toggle as={Card.Header} className={"text-light " + (formErrors.regional ? "bg-danger" : "bg-primary")} eventKey="1">
            Regional
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1">
            <Card.Body>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Nombre</Form.Label>
                  <Controller 
                    control={control}
                    name="regional"
                    render={({field, fieldState})=>{
                      return <RegionalesTypeahead
                        //@ts-ignore
                        style={{textTransform: "uppercase"}}                        
                        inputProps={{
                          style: {textTransform: "uppercase"}
                        }}
                        id="solicitud-atencion-externa-form/regionales"
                        filterBy={(regional: Regional)=>{
                          return (user?.can(Permisos.REGISTRAR_SOLICITUDES_DE_ATENCION_EXTERNA) ? true : 
                            (regional.id == user?.regionalId))
                        }}
                        isInvalid={!!fieldState.error}
                        feedback={fieldState.error?.message}
                        selected={field.value}
                        onBlur={field.onBlur}
                        onChange={(regional)=>{
                          setValue("medico", "")
                          setValue("proveedor", "")
                          field.onChange(regional)
                        }}
                      />
                    }}
                  />
                </Form.Group> 
              </Form.Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card style={{overflow: "visible"}} >
          <Accordion.Toggle as={Card.Header}  className={"text-light " + (formErrors.medico ? "bg-danger" : "bg-primary")} eventKey="2">
            Médico
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="2">
            <Card.Body>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    style={{textTransform: "uppercase"}}
                    isInvalid={!!formState.errors.medico}
                    {...register("medico")}
                  />
                  <Form.Control.Feedback type="invalid">{formState.errors?.medico?.message}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Especialidad</Form.Label>
                  <Form.Control
                    style={{textTransform: "uppercase"}}
                    isInvalid={!!formState.errors.especialidad}
                    {...register("especialidad")}
                  />
                  <Form.Control.Feedback type="invalid">{formState.errors?.especialidad?.message}</Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <PrestacionesSolicitadasCard />
      </Accordion>
      <Button className="mt-3" type="submit">
        {registrar.isLoading ? <Spinner className="mr-2" animation="border" size="sm"/> : null}
        <span>Guardar</span>
      </Button>
    </Form>
  </FormProvider>
}