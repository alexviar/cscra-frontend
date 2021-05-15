import React, { ComponentProps, useRef, useEffect } from "react"
import { Accordion, Button, Card,Col,Form, Spinner } from "react-bootstrap"
import { useForm, Controller, FormProvider } from "react-hook-form"
import moment from "moment"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { AseguradoCard, AseguradoInputs } from "./AseguradoCard"
import { MedicosTypeahead } from "./MedicosTypeahead"
import { PrestacionesSolicitadasInputs, PrestacionesSolicitadasCard } from "./PrestacionesSolicitadasCard"
import * as rules from "../../../../commons/components/rules"
import { useMutation } from "react-query"
import { Medico, SolicitudesAtencionExternaService } from "../services"
import { Regional, RegionalesTypeahead } from "../../../../commons/components"
import { useModal } from "../../../../commons/reusable-modal"
import { Dm11Viewer } from "./Dm11Viewer"
import { Permisos } from "../../../../commons/auth/constants"
import { useLoggedUser } from "../../../../commons/auth/hooks"
import { EstadosAfi, EstadosEmp } from "../utils"

type Inputs = AseguradoInputs & PrestacionesSolicitadasInputs & {
  regionalId: number | null
  medico?: Medico[]
}

const hoy = moment()

const schema = yup.object().shape({
  "asegurado": yup.object().shape({
    "matricula": yup.string().trim().matches(/^\d{2}-\d{4}-[a-zA-ZñÑ]{2,3}/).required(),
    "estado": yup.string().oneOf(Object.values(EstadosAfi), "Estado desconocido")
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
            message: "El asegurado figura como dado de baja, pero no se encontraron registros de la baja."
          })
        }
        return true
      }),
    "fechaExtinsion": yup.date().label("fecha de extinsion").nullable().notRequired().min(hoy.toDate(), "Fecha de extinsion alcanzada"),
    "fechaValidezSeguro": yup.date().label("fecha de extinsion").test("min", "", function(value, context){
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
  }),
  "titular": yup.lazy( titular => {
    console.log("Titular", titular)
    return titular ? yup.object().shape({
      "matricula": yup.string().trim().matches(/^\d{2}-\d{4}-[A-ZÑ]{2,3}/).required(),
      // "estado": yup.string().oneOf(Object.values(EstadosAfi)).test("estado-incoherente", "El asegurado figura como activo, pero hay un registro de su baja con fecha {$regDate}", function(value, context) {
      //   if(value == EstadosAfi[1] && context.parent.baja){
      //     context.createError({
      //       params: {
      //         regDate: context.parent.baja.regDate
      //       }
      //     })
      //     return true
      //   }
      //   return false
      // }),
      // "baja": yup.object().shape({
      //   "fechaValidezSeguro": yup.date().label("validez del seguro").nullable().notRequired().when("estado", {
      //     is: (estado: string) => estado == EstadosAfi[2],
      //     then: yup.date().min(hoy.toDate())
      //   })
      // })
    }) : yup.object().nullable().notRequired() 
  }),
  "empleador": yup.object().shape({
    "numeroPatronal": yup.string().required(),
    // "nombre": yup.string(),
    // "estado": yup.string().oneOf(Object.values(EstadosEmp)).test("estado-incoherente", "El empleador figura como activo, pero hay un registro de su baja con fecha {$fechaBaja}", function(value, context) {
    //   if(value == EstadosEmp[1] && context.parent.fechaBaja){
    //     context.createError({
    //       params: {
    //         fechaBaja: context.parent.fechaBaja
    //       }
    //     })
    //     return true
    //   }
    //   return false
    // }),
    // "fechaBaja": yup.lazy((value) => yup.date().min(hoy.subtract(2, "months").toDate())),
    // "enMora": yup.string().oneOf(["No"], "El empleador esta en mora")
  }).required()
})

export const SolicitudAtencionExternaForm = ()=>{
  const formMethods = useForm<Inputs>({
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: {
      prestacionesSolicitadas: [{
        id: 0,
        prestacionId: null,
        nota: ""
      }],
      asegurado: {
        apellidoPaterno: "",
        apellidoMaterno: "",
        nombres: "",
        estado: "",
        fechaExtinsion: "",
        // fechaValidezSeguro: ""
      }
    }
  })
  const {
    handleSubmit,
    trigger,
    formState,
    control,
    setValue,
    watch
  } = formMethods

  const dm11Viewer = useModal("dm11Viewer")

  const loggedUser = useLoggedUser()

  console.log("Errors", formState.errors)

  const registrar = useMutation((values: Inputs)=>{
    return SolicitudesAtencionExternaService.registrar(
      values.regionalId as number,
      values.asegurado.id,
      values.medico![0].id,
      values.proveedor![0].id,
      values.prestacionesSolicitadas.map(({prestacionId: prestacion_id, nota})=>({
        prestacion_id: prestacion_id as number,
        nota
      }))
    )
  }, {
    onSuccess: ({data: {urlDm11, regionalId}}) => {
      if(loggedUser.canAny([
        Permisos.EMITIR_SOLICITUDES_DE_ATENCION_EXTERNA,
        Permisos.EMITIR_SOLICITUDES_DE_ATENCION_EXTERNA_REGISTRADO_POR
      ]) || (loggedUser.can(Permisos.EMITIR_SOLICITUDES_DE_ATENCION_EXTERNA_MISMA_REGIONAL) && regionalId == loggedUser.regionalId)){
        dm11Viewer.open(urlDm11)
      }
    }
  })

  return <FormProvider {...formMethods}>
    <Form onSubmit={handleSubmit((values)=>{
      console.log("onSubmit", values)
      registrar.mutate(values)
    })}>
      <h1 style={{fontSize: "1.75rem"}}>Solicitud de atención externa</h1>
      <Accordion className="mt-3"  defaultActiveKey="0">
        <AseguradoCard />
        <Card style={{overflow: "visible"}} >
          <Accordion.Toggle as={Card.Header} className="bg-primary text-light" eventKey="1">
            Regional
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1">
            <Card.Body>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Nombre</Form.Label>
                  <Controller 
                    control={control}
                    name="regionalId"
                    rules={{
                      required: rules.required()
                    }}
                    render={({field, fieldState})=>{
                      return <RegionalesTypeahead
                        id="solicitud-atencion-externa-form/regionales"
                        filterBy={(regional: Regional)=>{
                          return loggedUser.can(Permisos.REGISTRAR_SOLICITUDES_DE_ATENCION_EXTERNA) ? true : (regional.id == loggedUser.regionalId)
                        }}
                        isInvalid={!!fieldState.error}
                        feedback={fieldState.error?.message}
                        onBlur={field.onBlur}
                        onChange={(regional)=>{
                          // setValue("medico", [])
                          // setValue("proveedor", [])
                          // trigger("medico")
                          // trigger("proveedor")
                          field.onChange(regional.length ? regional[0].id : null)
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
          <Accordion.Toggle as={Card.Header} className="bg-primary text-light" eventKey="2">
            Médico
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="2">
            <Card.Body>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Nombre</Form.Label>
                  <Controller 
                    control={control}
                    name="medico"
                    rules={{
                      required: rules.required()
                    }}
                    render={({field, fieldState})=>{
                      return <><MedicosTypeahead
                        id="solicitud-atencion-externa-form/medicos"
                        searchText="Buscando..."
                        promptText="Introduce un texto"
                        filterBy={(medico)=>medico.regionalId == watch("regionalId")}
                        className={fieldState.error ? "is-invalid" : ""}
                        isInvalid={!!formState.errors.medico}
                        selected={field.value}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                      />
                      <Form.Control.Feedback type="invalid">{fieldState.error?.message}</Form.Control.Feedback></>
                    }}
                  />
                </Form.Group> 
              </Form.Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <PrestacionesSolicitadasCard />
      </Accordion>
      <Button className="mt-3" type="submit">
        {registrar.isLoading ? <Spinner animation="border" size="sm"/> : null}
        Guardar
      </Button>
    </Form>
    <Dm11Viewer />
  </FormProvider>
}