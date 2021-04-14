import { useEffect, useRef } from "react"
import { Accordion, Card, Form, Col, InputGroup, FormControl, Button, Spinner } from "react-bootstrap"
import { useFormContext, useController } from "react-hook-form"
import { FaSearch } from "react-icons/fa"
import { useQuery } from "react-query"
import { nombreCompleto } from "../../../../commons/utils/nombreCompleto"
import { AseguradoChooser } from "./AseguradoChooser"
import { Asegurado, AseguradosService } from "../services/AseguradosService"
import { ImperativeModalRef } from "../../../../commons/components/ImperativeModal"
import * as rules from "../../../../commons/components/rules"

export type AseguradoInputs = {
  asegurado: {
    id: string,
    matricula: string,
    nombreCompleto: string
    estado: string,
    fechaExtinsion: string,
    empleador: {
      id: string,
      numeroPatronal: string,
      nombre: string,
      estado: string,
      aportes: string
    }
  },
}
export const AseguradoCard = ()=>{

  const {
    register,
    formState,
    trigger,
    setValue,
    watch
  } = useFormContext<AseguradoInputs>()

  const aseguradoChooserRef = useRef<ImperativeModalRef|null>(null)

  const matricula = watch("asegurado.matricula")
  const buscar = useQuery(["buscarAseguradoPorMatricula", matricula], ()=>{
    return AseguradosService.buscarPorMatricula(matricula)
  }, {
    enabled: false,
    onSuccess: ({data: records}) =>{
      if(records.length == 1){
        const asegurado = records[0]
        setValue("asegurado.id", asegurado.id)
        setValue("asegurado.nombreCompleto", nombreCompleto(asegurado.apellidoPaterno, asegurado.apellidoMaterno, asegurado.nombres))
        setValue("asegurado.estado", asegurado.estado)
        setValue("asegurado.fechaExtinsion", asegurado.fechaExtinsion)
        setValue("asegurado.empleador.numeroPatronal", asegurado.empleador.numeroPatronal)
        setValue("asegurado.empleador.nombre", asegurado.empleador.nombre)
        setValue("asegurado.empleador.estado", asegurado.empleador.estado)
        setValue("asegurado.empleador.aportes", asegurado.empleador.aportes)
        trigger("asegurado")
      }
      else if(records.length > 1) {
        aseguradoChooserRef.current?.show(true)
      }
    }
  })

  useEffect(()=>{
    setValue("asegurado.id", "")
    setValue("asegurado.nombreCompleto", "")
    setValue("asegurado.estado", "")
    setValue("asegurado.fechaExtinsion", "")
    setValue("asegurado.empleador.numeroPatronal", "")
    setValue("asegurado.empleador.nombre", "")
    setValue("asegurado.empleador.estado", "")
    setValue("asegurado.empleador.aportes", "")
  }, [matricula])

  return <Card >
    <Accordion.Toggle as={Card.Header} className="bg-primary text-light" eventKey="0">
      Asegurado
    </Accordion.Toggle>
    <Accordion.Collapse eventKey="0">
      <Card.Body>
        <Form.Row>
          <Col md={4}>
            <Form.Label htmlFor="asegurado-matricula">
              Matrícula
            </Form.Label>
            <InputGroup className="mb-2">
              <FormControl id="asegurado-matricula" {...register("asegurado.matricula")} />
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={()=>{
                  buscar.refetch()
                }}>
                  {buscar.isFetching ? <Spinner animation="border" size="sm" /> : <FaSearch />}
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
          <Form.Group as={Col} md={8}>
            <Form.Label>Nombre</Form.Label>
            <Form.Control 
              disabled
              isInvalid={!!formState.errors.asegurado?.nombreCompleto}
              {...register("asegurado.nombreCompleto", {
                required: rules.required()
              })}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} sm={4}>
            <Form.Label>Estado</Form.Label>
            <Form.Control 
              disabled
              isInvalid={!!formState.errors.asegurado?.estado}
              {...register("asegurado.estado", {
                required: rules.required()
              })}
            />
          </Form.Group>
          <Form.Group as={Col} sm={4}>
            <Form.Label>Fecha ext.</Form.Label>
            <Form.Control 
              disabled
              isInvalid={!!formState.errors.asegurado?.fechaExtinsion}
              {...register("asegurado.fechaExtinsion")}
            />
          </Form.Group>
        </Form.Row>
      {/* </Card.Body>
    </Accordion.Collapse>
  </Card>
  <Card >
    <Accordion.Toggle as={Card.Header} className="bg-primary text-light" eventKey="0">
      Empleador
    </Accordion.Toggle>
    <Accordion.Collapse eventKey="0">
      <Card.Body> */}
      <h2 style={{fontSize: "1.25rem"}}>Empleador</h2>
        <Form.Row>
          <Form.Group as={Col} md={4}>
            <Form.Label>Nº Patronal</Form.Label>
            <Form.Control
              disabled
              isInvalid={!!formState.errors.asegurado?.empleador?.numeroPatronal}
              {...register("asegurado.empleador.numeroPatronal")}
            />
          </Form.Group> 
          <Form.Group as={Col} md={8}>
            <Form.Label>Nombre</Form.Label>
            <Form.Control 
              disabled
              isInvalid={!!formState.errors.asegurado?.empleador?.nombre}
              {...register("asegurado.empleador.nombre")}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} sm={4}>
            <Form.Label>Estado</Form.Label>
            <Form.Control
              disabled
              isInvalid={!!formState.errors.asegurado?.empleador?.estado}
              {...register("asegurado.empleador.estado")}
            />
          </Form.Group>
          <Form.Group as={Col} sm={4}>
            <Form.Label>Aportes</Form.Label>
            <Form.Control
              disabled
              isInvalid={!!formState.errors.asegurado?.empleador?.nombre}
              {...register("asegurado.empleador.aportes")}
            />
          </Form.Group>
        </Form.Row>
        <AseguradoChooser ref={aseguradoChooserRef}
          asegurados={buscar.data?.data || []}
          onSelect={(id: string)=>{
            setValue("asegurado.id", id)
          }}
        />
      </Card.Body>
    </Accordion.Collapse>
  </Card>
}