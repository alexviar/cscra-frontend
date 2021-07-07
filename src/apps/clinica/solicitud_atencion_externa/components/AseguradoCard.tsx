import { useEffect, useState } from "react"
import { Accordion, Card, Form, Col, InputGroup, FormControl, Button, Spinner } from "react-bootstrap"
import { useFormContext, useWatch, ValidationRule } from "react-hook-form"
import { FaSearch } from "react-icons/fa"
import { useQuery } from "react-query"
import { nombreCompleto } from "../../../../commons/utils/nombreCompleto"
import { AseguradoChooser } from "./AseguradoChooser"
import { Asegurado, AseguradosService } from "../services/AseguradosService"
import moment from 'moment';

import { EstadosAfi, EstadosEmp } from "../utils"

export type AseguradoInputs = {
  regionalId: number,
  asegurado: {
    id: string
    matricula: string
    apellidoPaterno: string | null
    apellidoMaterno: string
    nombres: string
    fechaExtincion: string | null
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
    tieneBaja: boolean
    fechaRegBaja: string,
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

export const AseguradoCard = () => {

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

  const [aseguradoChooserVisible, showAseguradoChooser] = useState(false)

  const matricula = asegurado.matricula
  const buscar = useQuery(["asegurados.buscar", matricula], () => {
    return AseguradosService.buscarPorMatricula(matricula)
  }, {
    enabled: false,
    onSuccess: ({ data: { records } }) => {
      if (records.length == 1) {
        const asegurado = records[0]
        onChange(asegurado)
      }
      else {
        showAseguradoChooser(true)
      }
    }
  })

  const onChange = ({ empleador, titular, ...asegurado }: any) => {
    setValue("asegurado.id", asegurado.id)
    setValue("asegurado.apellidoPaterno", asegurado.apellidoPaterno || "")
    setValue("asegurado.apellidoMaterno", asegurado.apellidoMaterno || "")
    setValue("asegurado.nombres", asegurado.nombres)
    setValue("asegurado.tipo", asegurado.tipo)
    setValue("asegurado.estado", EstadosAfi[asegurado.estado])
    setValue("asegurado.tieneBaja", !!asegurado.baja)
    setValue("asegurado.fechaRegBaja", asegurado.baja?.regDate)
    setValue("asegurado.fechaValidezSeguro", asegurado.baja?.fechaValidezSeguro)
    setValue("asegurado.fechaExtincion", asegurado.fechaExtincion)

    setValue("titular.id", titular?.id)
    setValue("titular.matricula", titular?.matricula)
    setValue("titular.apellidoPaterno", titular?.apellidoPaterno)
    setValue("titular.apellidoMaterno", titular?.apellidoMaterno)
    setValue("titular.nombres", titular?.nombres)
    setValue("titular.estado", EstadosAfi[titular?.estado])
    setValue("titular.tieneBaja", !!titular?.baja)
    setValue("titular.fechaRegBaja", titular?.baja?.regDate)
    setValue("titular.fechaValidezSeguro", titular?.baja?.fechaValidezSeguro)

    setValue("empleador.id", empleador?.id)
    setValue("empleador.numeroPatronal", empleador?.numeroPatronal)
    setValue("empleador.nombre", empleador?.nombre)
    setValue("empleador.estado", EstadosEmp[empleador?.estado])
    setValue("empleador.fechaBaja", empleador?.fecha_baja)
    setValue("empleador.aportes", empleador?.aportes == 2 ? "Sí" : empleador?.aportes == 1 ? "No" : "")
  }

  useEffect(() => {
    if (asegurado.id && formState.dirtyFields.asegurado?.matricula) {
      setValue("asegurado.id", "")
      setValue("asegurado.apellidoPaterno", "")
      setValue("asegurado.apellidoMaterno", "")
      setValue("asegurado.nombres", "")
      setValue("asegurado.tipo", -1)
      setValue("asegurado.estado", "")
      setValue("asegurado.tieneBaja", false)
      setValue("asegurado.fechaRegBaja", "")
      setValue("asegurado.fechaValidezSeguro", null)
      setValue("asegurado.fechaExtincion", null)
      setValue("titular", {
        id: "",
        matricula: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        nombres: "",
        estado: "",
        tieneBaja: false,
        fechaRegBaja: "",
        fechaValidezSeguro: null
      })
      setValue("empleador.id", "")
      setValue("empleador.numeroPatronal", "")
      setValue("empleador.nombre", "")
      setValue("empleador.estado", "")
      setValue("empleador.fechaBaja", "")
      setValue("empleador.aportes", "")
    }
  }, [matricula])

  const formErrors = formState.errors
  const hasErrors = formErrors.asegurado || formErrors.titular || formErrors.empleador

  return <Card >
    <Accordion.Toggle as={Card.Header} className={"text-light " + (hasErrors ? "bg-danger" : "bg-primary")} eventKey="0">
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
                isInvalid={!!formErrors.asegurado?.matricula || !!formErrors.asegurado?.id}
                className="text-uppercase" {...register("asegurado.matricula")} />
              <InputGroup.Append >
                <Button variant="outline-secondary" onClick={() => {
                  trigger("asegurado.matricula")
                    .then((validation) => {
                      console.log("Matricula validation", validation)
                      if (!formErrors.asegurado?.matricula) {
                        if (formState.dirtyFields.asegurado?.matricula)
                          delete formState.dirtyFields.asegurado.matricula
                        clearErrors(["asegurado", "titular", "empleador"])
                        if (!buscar.data) {
                          buscar.refetch()
                        }
                        else {
                          const { data: { records } } = buscar.data
                          if (records.length == 1) {
                            const asegurado = records[0]
                            onChange(asegurado)
                          }
                          else {
                            showAseguradoChooser(true)
                          }
                        }
                      }
                    })
                }}>
                  {buscar.isFetching ? <Spinner animation="border" size="sm" /> : <FaSearch />}
                </Button>
              </InputGroup.Append>
              <Form.Control.Feedback type="invalid">{formErrors.asegurado?.matricula?.message}</Form.Control.Feedback>
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
              isInvalid={!!formErrors.asegurado?.estado}
              {...register("asegurado.estado")}
            >
            </Form.Control>
            <Form.Control.Feedback type="invalid">{formErrors.asegurado?.estado?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} sm={4}>
            <Form.Label>Validez del seguro</Form.Label>
            <Form.Control
              readOnly
              type="date"
              isInvalid={!!formErrors.asegurado?.fechaValidezSeguro}
              {...register("asegurado.fechaValidezSeguro")}
            />
            <Form.Control.Feedback type="invalid">{
              formErrors.asegurado?.fechaValidezSeguro?.message
            }</Form.Control.Feedback>
          </Form.Group>
          {asegurado.tipo == 2 ? <Form.Group as={Col} sm={4}>
            <Form.Label>Fecha extinsion</Form.Label>
            <Form.Control
              readOnly
              type="date"
              isInvalid={!!formErrors.asegurado?.fechaExtincion}
              {...register("asegurado.fechaExtincion")}
            />
            <Form.Control.Feedback type="invalid">{formErrors.asegurado?.fechaExtincion?.message}</Form.Control.Feedback>
          </Form.Group> : null}
        </Form.Row>
        {asegurado.tipo == 2 ? <div /*className={asegurado.tipo == 2 ? "" : "d-none"}*/ >
          {/* {watch("titular.id") ? <> */}
          <h2 style={{ fontSize: "1.25rem" }}>Titular</h2>
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
                isInvalid={!!formErrors.titular?.estado}
                {...register("titular.estado")}
              >
              </Form.Control>
              <Form.Control.Feedback type="invalid">{formErrors.titular?.estado?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} sm={4}>
              <Form.Label>Fecha de baja</Form.Label>
              <Form.Control
                readOnly
                type="date"
                isInvalid={!!formErrors.titular?.fechaValidezSeguro}
                {...register("titular.fechaValidezSeguro")}
              />
              <Form.Control.Feedback type="invalid">{formErrors.titular?.fechaValidezSeguro?.message}</Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          {/* </> : null} */}
        </div>
          : null}
        <h2 style={{ fontSize: "1.25rem" }}>Empleador</h2>
        <Form.Row>
          <Form.Group as={Col} md={4}>
            <Form.Label>Nº Patronal</Form.Label>
            <Form.Control
              readOnly
              isInvalid={!!formErrors.empleador?.numeroPatronal}
              {...register("empleador.numeroPatronal")}
            />
            <Form.Control.Feedback type="invalid">{formErrors.empleador?.numeroPatronal?.message}</Form.Control.Feedback>
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
              isInvalid={!!formErrors.empleador?.estado}
              {...register("empleador.estado")}
            />
            <Form.Control.Feedback type="invalid">{formErrors.empleador?.estado?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} sm={4}>
            <Form.Label>Fecha de baja</Form.Label>
            <Form.Control
              readOnly
              type="date"
              isInvalid={!!formErrors.empleador?.fechaBaja}
              {...register("empleador.fechaBaja")}
            />
            <Form.Control.Feedback type="invalid">{formErrors.empleador?.fechaBaja?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} sm={4}>
            <Form.Label>En mora</Form.Label>
            <Form.Control
              readOnly
              isInvalid={!!formErrors.empleador?.aportes}
              {...register("empleador.aportes")}
            />
            <Form.Control.Feedback type="invalid">{formErrors.empleador?.aportes?.message}</Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <AseguradoChooser
          title="Resultados"
          asegurados={buscar.data?.data.records || []}
          onSelect={(asegurado: Asegurado) => {
            // asegurado.matricula = watch("asegurado.matricula")
            onChange(asegurado)
            showAseguradoChooser(false)
          }}
          onHide={()=>showAseguradoChooser(false)}
        />
      </Card.Body>
    </Accordion.Collapse>
  </Card>
}