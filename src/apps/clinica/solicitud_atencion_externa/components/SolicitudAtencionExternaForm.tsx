import React, { ComponentProps, useRef } from "react"
import { Accordion, Button, Card,Col,Form, FormControl, InputGroup, Spinner, Table } from "react-bootstrap"
import { useForm, Controller, FormProvider } from "react-hook-form"
import { FaPlus, FaSearch } from "react-icons/fa"
import { AseguradoCard, AseguradoInputs } from "./AseguradoCard"
import { MedicosTypeahead } from "./MedicosTypeahead"
import { ProveedoresTypeahead } from "./ProveedoresTypeahead"
import { PrestacionesSolicitadasInputs, PrestacionesSolicitadasCard } from "./PrestacionesSolicitadasCard"
import * as rules from "../../../../commons/components/rules"
import { useMutation } from "react-query"
import { SolicitudesAtencionExternaService } from "../services/SolicitudesAtencionExternaService"
import { RegionalesTypeahead } from "../../../../commons/components/RegionalesTypeahead"
import { Medico } from "../services/MedicosService"
import { Dm11Viewer, Dm11ViewerRef } from "./Dm11Viewer"

type Inputs = AseguradoInputs & PrestacionesSolicitadasInputs & {
  regionalId: number | null
  medico?: Medico[]
}

export const SolicitudAtencionExternaForm = ()=>{
  const formMethods = useForm<Inputs>({
    mode: "onBlur",
    defaultValues: {
      prestacionesSolicitadas: [{
        id: 0,
        prestacionId: null,
        nota: ""
      }],
      asegurado: {
        titular: undefined
      }
    }
  })
  const {
    handleSubmit,
    register,
    trigger,
    formState,
    control,
    setValue,
    watch
  } = formMethods

  const dm11ViewerRef = useRef<Dm11ViewerRef>(null)

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
    onSuccess: ({data: {urlDm11}}) => {
      dm11ViewerRef.current?.setUrl(urlDm11)
      dm11ViewerRef.current?.show(true)
    }
  })

  // console.log("Solicitud", watch())  

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
                        searchText="Buscando..."
                        promptText="Introduce un texto"
                        isInvalid={!!fieldState.error}
                        onBlur={field.onBlur}
                        onChange={(regional)=>{
                          setValue("medico", undefined)
                          setValue("proveedor", undefined)
                          trigger("medico")
                          trigger("proveedor")
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
        {/* <Card style={{overflow: "visible"}} >
          <Accordion.Toggle as={Card.Header} className="bg-primary text-light" eventKey="4">
            Proveedor
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="4">
            <Card.Body>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Nombre</Form.Label>
                  <Controller
                    control={control}
                    name="proveedor"
                    rules={{
                      required: rules.required()
                    }}
                    render={({field, fieldState})=>{
                      return <>
                        <ProveedoresTypeahead
                          id="solicitud-atencion-externa-form/proveedores"
                          searchText="Buscando..."
                          promptText="Introduce un texto"
                          filterBy={(proveedor)=>(!watch("regionalId") || proveedor.regionalId == watch("regionalId")) && watch("prestacionesSolicitadas").every(ps=>proveedor.contrato.prestaciones.some(pc=>pc.id == ps.prestacionId))}
                          className={fieldState.error ? "is-invalid" : ""}
                          isInvalid={!!formState.errors.proveedor}
                          onBlur={field.onBlur}
                          onChange={field.onChange}
                        />
                        <Form.Control.Feedback type="invalid">{fieldState.error?.message}</Form.Control.Feedback>
                      </>
                    }}
                  />
                </Form.Group> 
              </Form.Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
       */}
      </Accordion>
      <Button className="mt-3" type="submit">
        {registrar.isLoading ? <Spinner animation="border" size="sm"/> : null}
        Guardar
      </Button>
    </Form>
    <Dm11Viewer ref={dm11ViewerRef} />
  </FormProvider>
}