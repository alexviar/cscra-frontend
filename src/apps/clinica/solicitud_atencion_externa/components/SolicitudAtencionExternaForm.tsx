import React, { ComponentProps } from "react"
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

type Inputs = AseguradoInputs & PrestacionesSolicitadasInputs & {
  regionalId: number | null
  medicoId: number | null
}

export const SolicitudAtencionExternaForm = ()=>{
  const formMethods = useForm<Inputs>({
    mode: "onBlur",
    defaultValues: {
      prestacionesSolicitadas: []
    }
  })
  const {
    handleSubmit,
    register,
    formState,
    control,
    watch
  } = formMethods

  const registrar = useMutation((values: Inputs)=>{
    return SolicitudesAtencionExternaService.registrar(
      values.regionalId as number,
      values.asegurado.id,
      values.medicoId as number,
      values.proveedor.id,
      values.prestacionesSolicitadas.map(({prestacionId: prestacion_id, nota})=>({
        prestacion_id,
        nota
      }))
    )
  })

  // console.log("Solicitud", watch())  

  return <FormProvider {...formMethods}>
    <Form>
      <h1 style={{fontSize: "1.75rem"}}>Solicitud de atención externa</h1>
      <Accordion className="mt-3"  defaultActiveKey="0">
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
                          console.log("Regional elegida", regional)
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
        <AseguradoCard />
        <Card style={{overflow: "visible"}} >
          <Accordion.Toggle as={Card.Header} className="bg-primary text-light" eventKey="1">
            Médico
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1">
            <Card.Body>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Nombre</Form.Label>
                  <Controller 
                    control={control}
                    name="medicoId"
                    rules={{
                      required: rules.required()
                    }}
                    render={({field})=>{
                      return <MedicosTypeahead
                        id="solicitud-atencion-externa-form/medicos"
                        searchText="Buscando..."
                        promptText="Introduce un texto"
                        isInvalid={!!formState.errors.medicoId}
                        onBlur={field.onBlur}
                        onChange={(medico)=>{
                          console.log("Medico elegido", medico)
                          field.onChange(medico.length ? medico[0].id : null)
                        }}
                      />
                    }}
                  />
                </Form.Group> 
              </Form.Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <PrestacionesSolicitadasCard />
        <Card style={{overflow: "visible"}} >
          <Accordion.Toggle as={Card.Header} className="bg-primary text-light" eventKey="3">
            Proveedor
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="3">
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
                          id="medico"
                          searchText="Buscando..."
                          isInvalid={!!fieldState.error}
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
      </Accordion>
      <Button>
        {registrar.isLoading ? <Spinner animation="border" size="sm"/> : null}
        Guardar
      </Button>
    </Form>
  </FormProvider>
}