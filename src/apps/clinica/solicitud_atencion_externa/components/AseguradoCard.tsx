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

const estadoText = (code?: number) => {
  console.log(code)
  if(code == 1) return "Alta"
  if(code == 2) return "Baja"
  return ""
}

const aportesText = (code?: number) => {
  if(code == 1) return "Al Día"
  if(code == 2) return "En Mora"
  return ""
}

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
    tieneBaja: boolean
    fechaRegBaja: string,
    fechaValidezSeguro?: string | null
  },
  titular: {
    id?: string
    matricula?: string
    apellidoPaterno?: string | null
    apellidoMaterno?: string
    nombres?: string
    estado?: string
    fechaValidezSeguro?: string | null
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
    clearErrors,
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

  const matricula = asegurado.matricula
  const buscar = useQuery(["asegurados.buscar", matricula], ()=>{
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
    setValue("asegurado.id", asegurado.id)
    setValue("asegurado.apellidoPaterno", asegurado.apellidoPaterno || "")
    setValue("asegurado.apellidoMaterno", asegurado.apellidoMaterno || "")
    setValue("asegurado.nombres", asegurado.nombres)
    setValue("asegurado.tipo", asegurado.tipo)
    setValue("asegurado.estado", estadoText(asegurado.estado))
    setValue("asegurado.tieneBaja", !!asegurado.baja)
    setValue("asegurado.fechaRegBaja", asegurado.baja?.regDate)
    setValue("asegurado.fechaValidezSeguro", asegurado.baja?.fechaValidezSeguro)
    setValue("asegurado.fechaExtinsion", asegurado.fechaExtinsion)
    if(titular){
      setValue("titular.id", titular?.id)
      setValue("titular.matricula", titular?.matricula)
      setValue("titular.apellidoPaterno", titular?.apellidoPaterno)
      setValue("titular.apellidoMaterno", titular?.apellidoMaterno)
      setValue("titular.nombres", titular?.nombres)
      setValue("titular.estado", estadoText(titular?.estado))
      setValue("titular.fechaValidezSeguro", titular?.fechaValidezd)
    }
    else{
      setValue("titular", {})
    }    
    setValue("empleador.id", empleador?.id)
    setValue("empleador.numeroPatronal", empleador?.numeroPatronal)
    setValue("empleador.nombre", empleador?.nombre)
    setValue("empleador.estado", estadoText(empleador?.estado))
    setValue("empleador.fechaBaja", empleador?.fecha_baja)
    setValue("empleador.aportes", aportesText(empleador?.estado))
  }

  useEffect(()=>{
    if(asegurado.id && formState.dirtyFields.asegurado?.matricula){
      setValue("asegurado.id", "")
      setValue("asegurado.apellidoPaterno", "")
      setValue("asegurado.apellidoMaterno", "")
      setValue("asegurado.nombres", "")
      setValue("asegurado.tipo", -1)
      setValue("asegurado.estado", "")
      setValue("asegurado.tieneBaja", false)
      setValue("asegurado.fechaRegBaja", "")
      setValue("asegurado.fechaValidezSeguro", "")
      setValue("asegurado.fechaExtinsion", "")
      setValue("titular", {})
      setValue("empleador.id", "")
      setValue("empleador.numeroPatronal", "")
      setValue("empleador.nombre", "")
      setValue("empleador.estado", "")
      setValue("empleador.fechaBaja", "")
      setValue("empleador.aportes", "")
    }
  }, [matricula])

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
                className="text-uppercase" {...register("asegurado.matricula")} />
              <InputGroup.Append >
                <Button variant="outline-secondary" onClick={()=>{
                  trigger("asegurado.matricula")
                  if(!formState.errors.asegurado?.matricula){
                    if(formState.dirtyFields.asegurado?.matricula)
                      delete formState.dirtyFields.asegurado.matricula
                    clearErrors(["asegurado", "titular", "empleador"])
                    if(!buscar.data){
                      buscar.refetch()
                    }
                    else{
                      const {data: {records}} = buscar.data
                      if(records.length == 1){
                        const asegurado = records[0]
                        onChange(asegurado)
                      }
                      else {
                        aseguradoChooserRef.current?.show(true)
                      }
                    }
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
              readOnly
              {...register("asegurado.apellidoPaterno")}
            />
          </Form.Group>
          <Form.Group as={Col} lg={3} md={6}>
            <Form.Label>Apellido Materno</Form.Label>
            <Form.Control 
              readOnly
              {...register("asegurado.apellidoMaterno")}
            />
          </Form.Group>
          <Form.Group as={Col} lg={3} md={6}>
            <Form.Label>Nombre</Form.Label>
            <Form.Control 
              readOnly
              {...register("asegurado.nombres")}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} sm={4}>
            <Form.Label>Estado</Form.Label>
            <Form.Control 
              readOnly
              isInvalid={!!formState.errors.asegurado?.estado}
              {...register("asegurado.estado")}
            >
            </Form.Control>
            <Form.Control.Feedback type="invalid">{formState.errors.asegurado?.estado?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} sm={4}>
            <Form.Label>Validez del seguro</Form.Label>
            <Form.Control 
              readOnly
              type="date"
              isInvalid={!!formState.errors.asegurado?.fechaValidezSeguro}
              {...register("asegurado.fechaValidezSeguro")}
            />
            <Form.Control.Feedback type="invalid">{
              formState.errors.asegurado?.fechaValidezSeguro?.message
            }</Form.Control.Feedback>
          </Form.Group>
          {asegurado.tipo == 2 ? <Form.Group as={Col} sm={4}>
            <Form.Label>Fecha extinsion</Form.Label>
            <Form.Control 
              readOnly
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
        { titular ? <div className={asegurado.tipo == 2 ? "" : "d-none"}>
          {/* {watch("titular.id") ? <> */}
          <h2 style={{fontSize: "1.25rem"}}>Titular</h2>
          <Form.Row>
            <Form.Group as={Col} lg={3} md={6}>
              <Form.Label>Matricula</Form.Label>
              <Form.Control 
                readOnly
                {...register("titular.matricula")}
              />
            </Form.Group>
            <Form.Group as={Col} lg={3} md={6}>
              <Form.Label>Apellido Paterno</Form.Label>
              <Form.Control 
                readOnly
                {...register("titular.apellidoPaterno")}
              />
            </Form.Group>
            <Form.Group as={Col} lg={3} md={6}>
              <Form.Label>Apellido Materno</Form.Label>
              <Form.Control 
                readOnly
                {...register("titular.apellidoMaterno")}
              />
            </Form.Group>
            <Form.Group as={Col} lg={3} md={6}>
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                readOnly
                {...register("titular.nombres")}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} sm={4}>
              <Form.Label>Estado</Form.Label>
              <Form.Control 
                readOnly
                isInvalid={!!formState.errors.titular?.estado}
                {...register("titular.estado", {
                  validate: {
                    unknown: (value) =>{
                      if(titular.id && value != "Alta" && value != "Baja"){
                        return "Estado desconocido";
                      }
                    }
                  }
                })}
              >
              </Form.Control>
              <Form.Control.Feedback type="invalid">{formState.errors.titular?.estado?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} sm={4}>
              <Form.Label>Fecha de baja</Form.Label>
              <Form.Control 
                readOnly
                isInvalid={!!formState.errors.titular?.fechaValidezSeguro}
                {...register("titular.fechaValidezSeguro", {
                  validate: {
                    afterDate: (value) => {
                      const now = moment()
                      if(titular.estado == "Baja"){
                        if(!value) return "Fecha sin especificar, se asume que el seguro ya no tiene validez"
                        if(moment(value, "DD/MM/YYYY").isSameOrBefore(now)) return "El seguro ya no tiene validez"
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
        : null}
        <h2 style={{fontSize: "1.25rem"}}>Empleador</h2>
        <Form.Row>
          <Form.Group as={Col} md={4}>
            <Form.Label>Nº Patronal</Form.Label>
            <Form.Control
              readOnly
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
              readOnly
              {...register("empleador.nombre")}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} sm={4}>
            <Form.Label>Estado</Form.Label>
            <Form.Control
              readOnly
              isInvalid={!!formState.errors.empleador?.estado}
              {...register("empleador.estado", {
                validate: {
                  unknown: (value) =>{
                    if(empleador.id && value != "Alta" && value != "Baja"){
                      return "Estado desconocido";
                    }
                  }
                }
              })}
            />
            <Form.Control.Feedback type="invalid">{formState.errors.empleador?.estado?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} sm={4}>
            <Form.Label>Fecha de baja</Form.Label>
            <Form.Control 
              readOnly
              isInvalid={!!formState.errors.empleador?.fechaBaja}
              {...register("empleador.fechaBaja", {
                validate: {
                  afterDate: (value) => {
                    const now = moment()
                    if(empleador.id && empleador.estado == "Baja"){
                      if(!value) return "Fecha sin especificar, se asume que el seguro ya no tiene validez"
                      if(moment(value, "DD/MM/YYYY").isSameOrBefore(now)) return "El seguro ya no tiene validez"
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
              readOnly
              isInvalid={!!formState.errors.empleador?.aportes}
              {...register("empleador.aportes", {
                validate: {
                  mora: (value) => {
                    if(value == "En Mora"){
                      return "El empleador esta en mora"
                    }
                  }
                }
              })}
            />
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