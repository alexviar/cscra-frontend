import { useEffect, useRef } from "react"
import { Accordion, Card, Form, Col, InputGroup, FormControl, Button, Spinner } from "react-bootstrap"
import { useFormContext, useWatch, ValidationRule } from "react-hook-form"
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
  asegurado: {
    id: string
    matricula: string
    apellidoPaterno: string | null
    apellidoMaterno: string
    nombres: string
    fechaExtinsion: string | null
    tipo: number
    estado: string
    fechaValidezSeguro: string | null
  },
  titular: {
    id: string
    matricula: string
    apellidoPaterno: string | null
    apellidoMaterno: string
    nombres: string
    estado: string
    fechaValidezSeguro: string | null
  },
  empleador: {
    id: string, 
    numeroPatronal: string, 
    nombre: string,
    estado: string,
    aportes: string,
    fechaBaja: string | null
  }
}
export const AseguradoCard = ()=>{

  const {
    register,
    formState,
    trigger,
    setValue,
    getValues,
    control,
    watch
  } = useFormContext<AseguradoInputs>()

  const asegurado = useWatch({
    control,
    name: 'asegurado', // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
  });
  const titular = useWatch({
    control,
    name: 'titular', // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
  });
  const empleador = useWatch({
    control,
    name: 'empleador', // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
  });

  const aseguradoChooserRef = useRef<ImperativeModalRef|null>(null)

  const matricula = asegurado.matricula//watch("asegurado.matricula")
  const buscar = useQuery(["buscarAseguradoPorMatricula", matricula], ()=>{
    return AseguradosService.buscarPorMatricula(matricula)
  }, {
    enabled: false,
    onSuccess: ({data: {records}}) =>{
      if(records.length == 1){
        const asegurado = records[0]
        onChange(asegurado)
      }
      else {
        aseguradoChooserRef.current?.show(true)
      }
    }
  })

  const onChange = ({empleador, titular, ...asegurado}: any) => {
    setValue("asegurado", asegurado)
    setValue("titular", titular||{})
    setValue("empleador", empleador || {})
  }

  useEffect(()=>{
    if(asegurado.id && formState.dirtyFields.asegurado?.matricula){
      setValue("asegurado.id", "")
      setValue("asegurado.apellidoPaterno", "")
      setValue("asegurado.apellidoMaterno", "")
      setValue("asegurado.nombres", "")
      setValue("asegurado.estado", "")
      setValue("asegurado.fechaValidezSeguro", "")
      setValue("asegurado.fechaExtinsion", "")
      setValue("titular.id", "")
      setValue("titular.apellidoPaterno", "")
      setValue("titular.apellidoMaterno", "")
      setValue("titular.nombres", "")
      setValue("titular.estado", "")
      setValue("titular.fechaValidezSeguro", "")
      setValue("empleador.numeroPatronal", "")
      setValue("empleador.nombre", "")
      setValue("empleador.estado", "")
      setValue("empleador.fechaBaja", "")
      setValue("empleador.aportes", "")
    }
  }, [matricula])

  useEffect(()=>{
    console.log("Change ", asegurado)
  }, [asegurado])

  return <Card >
    <Accordion.Toggle as={Card.Header} className="bg-primary text-light" eventKey="0">
      Asegurado
    </Accordion.Toggle>
    <Accordion.Collapse eventKey="0">
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
                pattern: rules.pattern(/^\d{2}-\d{4}-[aábcdeéfghijklmnñoópqrstuúüvwxyzAÁBCDEÉFGHIJKLMNÑOÓPQRSTUÚÜVWXYZ]{2,3}$/)
              })} />
              <InputGroup.Append >
                <Button variant="outline-secondary" onClick={()=>{
                  trigger("asegurado.matricula")
                  if(!formState.errors.asegurado?.matricula){
                    // setValue("asegurado.matricula", watch("asegurado.matricula"))
                    if(formState.dirtyFields.asegurado?.matricula)
                      delete formState.dirtyFields.asegurado.matricula
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
              {...register("asegurado.estado")}
            >
              <option value=""></option>
              <option value="1">Alta</option>
              <option value="2">Baja</option>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} sm={4}>
            <Form.Label>Validez del seguro</Form.Label>
            <Form.Control 
              disabled
              isInvalid={!!formState.errors.asegurado?.fechaValidezSeguro}
              {...register("asegurado.fechaValidezSeguro", {
                validate: {
                  afterDate: (value) => {
                    const now = moment()
                    console.log("CHECK", watch("asegurado"))
                    if(asegurado.estado != "1" && (!value || moment(value, "DD/MM/YYYY").isSameOrBefore(now))){
                      return "El seguro ya no tiene validez"
                    } 
                  }
                }
              })}
            />
            <Form.Control.Feedback type="invalid">{formState.errors.asegurado?.fechaValidezSeguro?.message}</Form.Control.Feedback>
          </Form.Group>
          {watch("asegurado.tipo") == 2 ? <Form.Group as={Col} sm={4}>
            <Form.Label>Fecha extinsion</Form.Label>
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
          </Form.Group> : null}
        </Form.Row>
        <div className={titular.id ? "" : "d-none"}>
          {/* {watch("titular.id") ? <> */}
          <h2 style={{fontSize: "1.25rem"}}>Titular</h2>
          <Form.Row>
            <Form.Group as={Col} lg={3} md={6}>
              <Form.Label>Matricula</Form.Label>
              <Form.Control 
                disabled
                {...register("titular.matricula")}
              />
            </Form.Group>
            <Form.Group as={Col} lg={3} md={6}>
              <Form.Label>Apellido Paterno</Form.Label>
              <Form.Control 
                disabled
                {...register("titular.apellidoPaterno")}
              />
            </Form.Group>
            <Form.Group as={Col} lg={3} md={6}>
              <Form.Label>Apellido Materno</Form.Label>
              <Form.Control 
                disabled
                {...register("titular.apellidoMaterno")}
              />
            </Form.Group>
            <Form.Group as={Col} lg={3} md={6}>
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                disabled
                {...register("titular.nombres")}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} sm={4}>
              <Form.Label>Estado</Form.Label>
              <Form.Control 
                as="select"
                disabled
                {...register("titular.estado")}
              >
                <option value=""></option>
                <option value="1">Alta</option>
                <option value="2">Baja</option>
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} sm={4}>
              <Form.Label>Fecha de baja</Form.Label>
              <Form.Control 
                disabled
                isInvalid={!!formState.errors.titular?.fechaValidezSeguro}
                {...register("titular.fechaValidezSeguro", {
                  validate: {
                    afterDate: (value) => {
                      const now = moment()
                      if(titular.id && titular.estado != "1" && (!value || moment(value, "DD/MM/YYYY").isSameOrBefore(now))){
                        return "El seguro del titular ya no tiene validez"
                      } 
                    }
                  }
                })}
              />
              <Form.Control.Feedback type="invalid">{formState.errors.titular?.fechaValidezSeguro?.message}</Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          {/* </> : null} */}
        </div>

        <h2 style={{fontSize: "1.25rem"}}>Empleador</h2>
        <Form.Row>
          <Form.Group as={Col} md={4}>
            <Form.Label>Nº Patronal</Form.Label>
            <Form.Control
              disabled
              isInvalid={!!formState.errors.empleador?.numeroPatronal}
              {...register("empleador.numeroPatronal", {
                required: rules.required()
              })}
            />
            <Form.Control.Feedback type="invalid">{formState.errors.empleador?.numeroPatronal?.message}</Form.Control.Feedback>
          </Form.Group> 
          <Form.Group as={Col} md={8}>
            <Form.Label>Nombre</Form.Label>
            <Form.Control 
              disabled
              {...register("empleador.nombre")}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} sm={4}>
            <Form.Label>Estado</Form.Label>
            <Form.Control
              as="select"
              disabled
              {...register("empleador.estado")}
            >
              <option value=""></option>
              <option value="2">Baja</option>
              <option value="1">Alta</option>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} sm={4}>
            <Form.Label>Fecha de baja</Form.Label>
            <Form.Control 
              disabled
              isInvalid={!!formState.errors.empleador?.fechaBaja}
              {...register("empleador.fechaBaja", {
                validate: {
                  afterDate: (value) => {
                    const now = moment()
                    if(empleador.estado != "1" && (!value || moment(value, "DD/MM/YYYY").add(2, "months").isSameOrBefore(now))){
                      return "El empleador ha sido dado de baja"
                    } 
                  }
                }
              })}
            />
            <Form.Control.Feedback type="invalid">{formState.errors.empleador?.fechaBaja?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} sm={4}>
            <Form.Label>Aportes</Form.Label>
            <Form.Control
              as="select"
              disabled
              isInvalid={!!formState.errors.empleador?.aportes}
              {...register("empleador.aportes", {
                validate: {
                  mora: (value) => {
                    if(value == "2"){
                      return "El empleador esta en mora"
                    }
                  }
                }
              })}
            >
              <option></option>
              <option value="2">En mora</option>
              <option value="1">Al día</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">{formState.errors.empleador?.aportes?.message}</Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <AseguradoChooser ref={aseguradoChooserRef}
          title="Resultados"
          asegurados={buscar.data?.data.records || []}
          onSelect={(asegurado: Asegurado)=>{
            // asegurado.matricula = watch("asegurado.matricula")
            onChange(asegurado)
            aseguradoChooserRef.current!.show(false)
          }}
        />
      </Card.Body>
    </Accordion.Collapse>
  </Card>
}