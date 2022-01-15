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

const estadoAfiSchema = function(asegurado: any, schema: any) {
  schema.oneOf(Object.values(EstadosAfi), "Estado desconocido")
  if(asegurado.afiliacion.baja)
    return schema.notOneOf([EstadosAfi[1]], `El asegurado figura como activo, pero hay un registro de su baja con fecha ${asegurado.afiliacion.baja.fechaRegistro}.`)
  else
    return schema.notOneOf([EstadosAfi[2]], `El asegurado figura como dado de baja, aunque no se encontraron registros de la misma.`)
}

const bajaAfiSchema = function(asegurado: any, schema: any) {
  return asegurado.afiliacion.baja ? schema.shape({
    fechaValidezSeguro: yup.date().format().emptyStringTo(null).nullable()
      .min(hoy, "El seguro ya no tiene validez")
      .required("Fecha sin especificar, se asume que el seguro ya no tiene validez")
  }) : schema
}

const estadoEmpSchema = function(empleador: any, schema: any) {
  schema.oneOf(Object.values(EstadosEmp), "Estado desconocido")
  if(empleador.fechaBaja){
    schema.notOneOf(EstadosEmp[1], "El empleador figura como activo, pero tiene fecha de baja")
  }
  return schema
}

const schema = yup.object().shape({
  asegurado: yup.object().when("$asegurado", function(asegurado: any, schema: any) {
    if(!asegurado) return schema.test("", "", function(value: any, context: any){
      return context.createError({
        message: "Debe proporcionar los datos del afiliado"
      })
    })
    else return schema.shape({
      matricula: yup.string().label("matricula").trim().uppercase().required(),  // .matches(/^\d{2}-\d{4}-[a-zA-ZñÑ]{2,3}$/, "Formato incorrecto."),
      estado: estadoAfiSchema(asegurado, yup.string().label("estado")),
      fechaExtincion: yup.date().format().emptyStringTo(null).nullable().label("fecha de extinsion").notRequired()
        .min(hoy.toDate(), "Fecha de extinsion alcanzada"),
      baja: bajaAfiSchema(asegurado, yup.object())
    })
  }),
  titular: yup.object().when("$asegurado", function(asegurado: any, schema: any){
    if(asegurado?.tipo == 2) {
      if(!asegurado.titular){
        return schema.oneOf([NaN], "No se encontraron datos del titular")
      }
      if(asegurado?.afiliacion?.parentesco != 8)
        return schema.shape({
          estado: estadoAfiSchema(asegurado.titular, yup.string().label("estado")),
          baja: bajaAfiSchema(asegurado, yup.object())
        })
    }
  }),
  empleador: yup.object().when("$asegurado", function(asegurado: any, schema: any){
    if(asegurado){
      const empleador = asegurado.empleador
      return !!empleador ? schema.shape({
        estado: estadoEmpSchema(empleador, yup.string().label("estado")),
        fechaBaja: yup.date().format().emptyStringTo(null).nullable().when("estado", {
          is: (estado: string) => estado == EstadosEmp[2] || estado == EstadosEmp[3],
          then: (schema) => schema.required("Fecha sin especificar, se asume que el seguro ya no tiene validez")
                   .min(hoy.subtract(2, "months").toDate(), "Han pasado mas de 2 meses desde la baja, el seguro ya no tiene validez")
        }),
        enMora: yup.string().oneOf(["No"], "El empleador esta en mora")
      }) : schema.oneOf([NaN], "No se encontraron datos del empleador")
    }
  }),
  regional: yup.array().length(1, "Debe seleccionar una regional"),
  medico: yup.string().trim().uppercase().required(),
  especialidad: yup.string().trim().uppercase().required(),
  proveedor: yup.string().trim().uppercase().required(),
  prestacionesSolicitadas: yup.array().of(yup.object().shape({
    prestacion: yup.string().trim().uppercase().required("Debe indicar una prestacion")
  })).min(1, "Debe solicitar un servicio").max(1, "Solo puede solicitar un servicio")
})

export const SolicitudAtencionExternaForm = ()=>{
  const [asegurado, setAsegurado] = useState<Asegurado|null>(null)
  
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
        setAsegurado(null)
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
        if(key == "empleador.aportes") localKey = "empleador.enMora"
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
      return <Alert variant="danger">
        Ocurrio un error al procesar la solicitud
      </Alert>
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
        <Card className="overflow-visible">
          <div className="overflow-hidden">
            <Accordion.Toggle as={Card.Header} className={"text-light " + (formErrors.regional ? "bg-danger" : "bg-primary")} eventKey="1">
              Regional
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <Form.Row>
                  <Form.Group as={Col} className="position-unset">
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
                            if(user?.can(Permisos.REGISTRAR_SOLICITUDES_DE_ATENCION_EXTERNA_MISMA_REGIONAL)) return regional.id == user?.regionalId
                            return true
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
          </div>
        </Card>
        <Card className="overflow-visible">
          <div className="overflow-hidden">
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
          </div>
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