import { useEffect, useRef } from "react"
import { Accordion, Card, Form, Col, InputGroup, FormControl, Button, Spinner } from "react-bootstrap"
import { useFormContext, useController, ValidationRule } from "react-hook-form"
import { FaSearch } from "react-icons/fa"
import { useQuery } from "react-query"
import { nombreCompleto } from "../../../../commons/utils/nombreCompleto"
import { AseguradoChooser } from "./AseguradoChooser"
import { Asegurado, AseguradosService } from "../services/AseguradosService"
import { ImperativeModalRef } from "../../../../commons/components/ImperativeModal"
import * as rules from "../../../../commons/components/rules"
import moment from 'moment';

export type AseguradoInputs = {
  regionalId: number,
  asegurado: Asegurado,
}
export const AseguradoCard = ()=>{

  const {
    register,
    formState,
    reset,
    trigger,
    setValue,
    watch
  } = useFormContext<AseguradoInputs>()

  console.log("FormState", watch(), formState.errors)

  const aseguradoChooserRef = useRef<ImperativeModalRef|null>(null)

  const matricula = watch("asegurado.matricula")
  const buscar = useQuery(["buscarAseguradoPorMatricula", matricula], ()=>{
    return AseguradosService.buscarPorMatricula(matricula)
  }, {
    enabled: false,
    onSuccess: ({data: {records}}) =>{
      if(records.length == 1){
        const asegurado = records[0]
        setValue("asegurado", asegurado)
        trigger("asegurado.fechaExtinsion")
        trigger("asegurado.fechaBaja")
        trigger("asegurado.titular.fechaBaja")
        trigger("asegurado.empleador.fechaBaja")
        trigger("asegurado.empleador.aportes")
      }
      else {
        aseguradoChooserRef.current?.show(true)
      }
    }
  })

  useEffect(()=>{
    if(watch("asegurado.id") && formState.dirtyFields.asegurado?.matricula){
      setValue("asegurado.id", "")
      setValue("asegurado.apellidoPaterno", "")
      setValue("asegurado.apellidoMaterno", "")
      setValue("asegurado.nombres", "")
      setValue("asegurado.estado", "")
      setValue("asegurado.fechaBaja", "")
      setValue("asegurado.fechaExtinsion", "")
      setValue("asegurado.empleador.numeroPatronal", "")
      setValue("asegurado.empleador.nombre", "")
      setValue("asegurado.empleador.estado", "")
      setValue("asegurado.empleador.aportes", "")
    }
  }, [matricula])

  return <Card >
    <Accordion.Toggle as={Card.Header} className="bg-primary text-light" eventKey="1">
      Asegurado
    </Accordion.Toggle>
    <Accordion.Collapse eventKey="1">
      <Card.Body>
        <Form.Row>
          <Col lg={3} md={6}>
            <Form.Label htmlFor="asegurado-matricula">
              Matrícula
            </Form.Label>
            <InputGroup hasValidation className="mb-2">
              <FormControl id="asegurado-matricula"
                isInvalid={!!formState.errors.asegurado?.matricula || !!formState.errors.asegurado?.id}
                className="text-uppercase" {...register("asegurado.matricula", {
                required: rules.required(),
                pattern: rules.pattern(/^\d{2}-\d{4}-[a-zA-Z]{3}(-\d)?$/)
              })} />
              <InputGroup.Append >
                <Button variant="outline-secondary" onClick={()=>{
                  trigger("asegurado.matricula")
                  if(!formState.errors.asegurado?.matricula){
                    reset({
                      asegurado: {
                        matricula: watch("asegurado.matricula")
                      }
                    })
                    buscar.refetch()
                  }
                }}>
                  {buscar.isFetching ? <Spinner animation="border" size="sm" /> : <FaSearch />}
                </Button>
              </InputGroup.Append>
              <Form.Control.Feedback type="invalid">{formState.errors.asegurado?.matricula?.message}</Form.Control.Feedback>
            </InputGroup>
          </Col>
          <Form.Group as={Col} lg={3} md={6}>
            <Form.Label>Apellido Paterno</Form.Label>
            <Form.Control 
              disabled
              isInvalid={!!formState.errors.asegurado?.apellidoPaterno}
              {...register("asegurado.apellidoPaterno")}
            />
          </Form.Group>
          <Form.Group as={Col} lg={3} md={6}>
            <Form.Label>Apellido Materno</Form.Label>
            <Form.Control 
              disabled
              isInvalid={!!formState.errors.asegurado?.apellidoPaterno}
              {...register("asegurado.apellidoMaterno")}
            />
          </Form.Group>
          <Form.Group as={Col} lg={3} md={6}>
            <Form.Label>Nombre</Form.Label>
            <Form.Control 
              disabled
              isInvalid={!!formState.errors.asegurado?.apellidoPaterno}
              {...register("asegurado.nombres", {required: rules.required()})}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} sm={4}>
            <Form.Label>Estado</Form.Label>
            <Form.Control 
              as="select"
              disabled
              isInvalid={!!formState.errors.asegurado?.estado}
              {...register("asegurado.estado", {
                required: rules.required()
              })}
            >
              <option value=""></option>
              <option value="1">Alta</option>
              <option value="0">Baja</option>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} sm={4}>
            <Form.Label>Fecha de baja</Form.Label>
            <Form.Control 
              disabled
              isInvalid={!!formState.errors.asegurado?.fechaBaja}
              {...register("asegurado.fechaBaja", {
                validate: {
                  afterDate: (value) => {
                    const now = moment()
                    if(value && moment(value, "DD/MM/YYYY").add(60, "days").isSameOrBefore(now)){
                      return "Pasaron mas de 60 dias desde la fecha de baja"
                    } 
                  }
                }
              })}
            />
            <Form.Control.Feedback type="invalid">{formState.errors.asegurado?.fechaBaja?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} sm={4}>
            <Form.Label>Fecha ext.</Form.Label>
            <Form.Control 
              disabled
              isInvalid={!!formState.errors.asegurado?.fechaExtinsion}
              {...register("asegurado.fechaExtinsion", {
                validate: {
                  afterDate: (value) => {
                    const now = moment()
                    if(value && moment(value, "DD/MM/YYYY").isSameOrBefore(now)){
                      return "Se ha cumplido la fecha de extinsion"
                    } 
                  }
                }
              })}
            />
            <Form.Control.Feedback type="invalid">{formState.errors.asegurado?.fechaExtinsion?.message}</Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <div className={watch("asegurado")?.titularId ? "" : "d-none"}>
          <h2 style={{fontSize: "1.25rem"}}>Titular</h2>
          <Form.Row>
            <Form.Group as={Col} lg={3} md={6}>
              <Form.Label>Matricula</Form.Label>
              <Form.Control 
                disabled
                isInvalid={!!formState.errors.asegurado?.apellidoPaterno}
                {...register("asegurado.titular.matricula")}
              />
            </Form.Group>
            <Form.Group as={Col} lg={3} md={6}>
              <Form.Label>Apellido Paterno</Form.Label>
              <Form.Control 
                disabled
                isInvalid={!!formState.errors.asegurado?.apellidoPaterno}
                {...register("asegurado.titular.apellidoPaterno")}
              />
            </Form.Group>
            <Form.Group as={Col} lg={3} md={6}>
              <Form.Label>Apellido Materno</Form.Label>
              <Form.Control 
                disabled
                {...register("asegurado.titular.apellidoMaterno")}
              />
            </Form.Group>
            <Form.Group as={Col} lg={3} md={6}>
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                disabled
                {...register("asegurado.titular.nombres")}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} sm={4}>
              <Form.Label>Estado</Form.Label>
              <Form.Control 
                as="select"
                disabled
                isInvalid={!!formState.errors.asegurado?.titular?.estado}
                {...register("asegurado.titular.estado", {  
                  validate: {
                    required: (value) => {
                      return watch("asegurado.titularId") && rules.required().message
                    }
                  }
                })}
              >
                <option value=""></option>
                <option value="1">Alta</option>
                <option value="0">Baja</option>
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} sm={4}>
              <Form.Label>Fecha de baja</Form.Label>
              <Form.Control 
                disabled
                isInvalid={!!formState.errors.asegurado?.titular?.fechaBaja}
                {...register("asegurado.titular.fechaBaja", {
                  validate: {
                    afterDate: (value) => {
                      const now = moment()
                      if(value && moment(value, "DD/MM/YYYY").add(60, "days").isSameOrBefore(now)){
                        return "Pasaron mas de 60 dias desde la fecha de baja"
                      } 
                    }
                  }
                })}
              />
              <Form.Control.Feedback type="invalid">{formState.errors.asegurado?.titular?.fechaBaja?.message}</Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
        </div>

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
              as="select"
              disabled
              isInvalid={!!formState.errors.asegurado?.empleador?.estado}
              {...register("asegurado.empleador.estado")}
            >
              <option value=""></option>
              <option value="0">Baja</option>
              <option value="1">Alta</option>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} sm={4}>
            <Form.Label>Fecha de baja</Form.Label>
            <Form.Control 
              disabled
              isInvalid={!!formState.errors.asegurado?.empleador?.fechaBaja}
              {...register("asegurado.empleador.fechaBaja", {
                validate: {
                  afterDate: (value) => {
                    const now = moment()
                    if(value && moment(value, "DD/MM/YYYY").add(60, "days").isSameOrBefore(now)){
                      return "Pasaron mas de 60 dias desde la fecha de baja"
                    } 
                  }
                }
              })}
            />
            <Form.Control.Feedback type="invalid">{formState.errors.asegurado?.empleador?.fechaBaja?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} sm={4}>
            <Form.Label>Aportes</Form.Label>
            <Form.Control
              as="select"
              disabled
              isInvalid={!!formState.errors.asegurado?.empleador?.aportes}
              {...register("asegurado.empleador.aportes", {
                validate: {
                  mora: (value) => {
                    if(value == "0"){
                      return "El empleador esta en mora"
                    }
                  }
                }
              })}
            >
              <option></option>
              <option value="0">En mora</option>
              <option value="1">Al día</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">{formState.errors.asegurado?.empleador?.aportes?.message}</Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <AseguradoChooser ref={aseguradoChooserRef}
          title="Resultados"
          asegurados={buscar.data?.data.records || []}
          onSelect={(asegurado: Asegurado)=>{
            // asegurado.matricula = watch("asegurado.matricula")
            setValue("asegurado", asegurado)
            trigger("asegurado.fechaExtinsion")
            trigger("asegurado.fechaBaja")
            trigger("asegurado.titular.fechaBaja")
            trigger("asegurado.empleador.fechaBaja")
            trigger("asegurado.empleador.aportes")
            aseguradoChooserRef.current!.show(false)
          }}
        />
      </Card.Body>
    </Accordion.Collapse>
  </Card>
}