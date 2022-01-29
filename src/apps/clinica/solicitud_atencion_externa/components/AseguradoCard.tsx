import { useEffect, useState, useRef } from "react"
import { Accordion, Alert, Card, Form, Col, InputGroup, FormControl, Button, Spinner } from "react-bootstrap"
import { useFormContext } from "react-hook-form"
import { FaSearch } from "react-icons/fa"
import { useQuery } from "react-query"
import { AseguradoChooser } from "./AseguradoChooser"
import { Asegurado, AseguradosService } from "../services/AseguradosService"
import moment from 'moment';

export type AseguradoInputs = {
  asegurado: {
    matricula: string
    apellidoPaterno: string
    apellidoMaterno: string
    nombres: string
    parentesco: string
    estado: string
    baja: {
      fechaValidezSeguro: string
    }
    fechaExtincion: string
  }
  titular: {
    matricula: string
    apellidoPaterno: string
    apellidoMaterno: string
    nombres: string
    estado: string
    baja: {
      fechaValidezSeguro: string
    }
  }
  empleador: {
    numeroPatronal: string
    nombre: string
    estado: string
    fechaBaja: string
    enMora: string
  }
}

export const AseguradoCard = (props: {
  value: Asegurado | null
  onChange(asegurado: Asegurado | null): void
}) => {

  const {
    register,
    formState,
    trigger,
    setValue,
    clearErrors,
    control,
    watch
  } = useFormContext<AseguradoInputs>()

  const [aseguradoChooserVisible, showAseguradoChooser] = useState(false)

  const asegurado = props.value
  const matricula = watch("asegurado.matricula")
  const buscar = useQuery(["asegurados.buscar", matricula], () => {
    return AseguradosService.buscarPorMatricula(matricula)
  }, {
    enabled: false,
    onSuccess: ({ data: { records } }) => {
      if (records.length == 1) {
        const asegurado = records[0]
        props.onChange(asegurado)
      }
      else {
        showAseguradoChooser(true)
      }
    }
  })

  const getParentesco = (code: number) => {
    switch(code){
      case 1: return "Hijo(a)"
      case 2: return "Esposa"
      case 3: return "Conviviente"
      case 4: return "Madre"
      case 5: return "Padre"
      case 6: return "Hermano(a)"
      case 7: return "Esposo"
      case 8: return "Derechohabiente"
      default: return ""
    }
  }

  useEffect(()=>{
    const empleador = asegurado?.empleador
    // setValue("asegurado.matricula", asegurado?.matricula || "")
    setValue("asegurado.apellidoPaterno", asegurado?.apellidoPaterno || "")
    setValue("asegurado.apellidoMaterno", asegurado?.apellidoMaterno || "")
    setValue("asegurado.nombres", asegurado?.nombres || "")
    setValue("asegurado.estado", asegurado?.estadoText || "")
    // const valSeguro = asegurado?.afiliacion?.baja?.fechaValidezSeguro
    if(asegurado?.afiliacion?.baja?.fechaValidezSeguro) setValue("asegurado.baja.fechaValidezSeguro",  moment(asegurado?.afiliacion?.baja?.fechaValidezSeguro).format('L'))
    setValue("empleador.numeroPatronal", empleador?.numeroPatronal || "")
    setValue("empleador.nombre", empleador?.nombre || "")
    setValue("empleador.estado", empleador?.estadoText || "")
    setValue("empleador.fechaBaja", empleador?.fechaBaja ? moment(empleador?.fechaBaja).format("L") : "")
    setValue("empleador.enMora", empleador?.enMora ? "Sí" : empleador?.enMora === false ? "No" : "")

    if(asegurado?.tipo == 2) {
      const titular = asegurado?.titular
      const extincion = asegurado?.afiliacion?.fechaExtincion
      const parentesco = getParentesco(asegurado?.afiliacion?.parentesco);

      setValue("asegurado.parentesco", parentesco)
      setValue("asegurado.fechaExtincion", extincion ? moment(extincion).format('L') : "")
      setValue("titular.matricula", titular?.matricula || "")
      setValue("titular.apellidoPaterno", titular?.apellidoPaterno || "")
      setValue("titular.apellidoMaterno", titular?.apellidoMaterno || "")
      setValue("titular.nombres", titular?.nombres || "")
      setValue("titular.estado", titular?.estadoText)
      // const valSeguroTit = titular?.afiliacion?.baja?.fechaValidezSeguro
      if(titular?.afiliacion?.baja?.fechaValidezSeguro) setValue("titular.baja.fechaValidezSeguro", moment(titular?.afiliacion?.baja?.fechaValidezSeguro).format('L'))
    }
  }, [asegurado])

  useEffect(() => {
    if (asegurado && formState.dirtyFields.asegurado?.matricula) {
      props.onChange(null)
    }
  }, [matricula])

  const formErrors = formState.errors
  const hasErrors = formErrors.asegurado || formErrors.titular || formErrors.empleador

  const buscarAseguradoHandler = () => {
    trigger("asegurado.matricula")
      .then((validation) => {
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
              props.onChange(asegurado)
            }
            else {
              showAseguradoChooser(true)
            }
          }
        }
      })
  }

  return <Card >
    <Accordion.Toggle as={Card.Header} className={"text-light " + (hasErrors ? "bg-danger" : "bg-primary")} eventKey="0">
      Asegurado
    </Accordion.Toggle>
    <Accordion.Collapse eventKey="0">
      <Card.Body>
        <div>
          {(formErrors.asegurado as any)?.message ? <Alert variant="danger">
            {(formErrors.asegurado as any)?.message}
          </Alert> : null}
          <Form.Row>
            <Form.Group as={Col} lg={3} md={6}>
              <Form.Label htmlFor="asegurado-matricula">
                Matrícula
              </Form.Label>
              <InputGroup hasValidation>
                <FormControl id="asegurado-matricula"
                  isInvalid={!!formErrors.asegurado?.matricula || buscar.isError}
                  className="text-uppercase" {...register("asegurado.matricula")}
                  aria-describedby="matriculaHelpBlock" />
                <InputGroup.Append >
                  <Button variant={(formErrors.asegurado?.matricula || buscar.isError) ? "outline-danger" : "outline-secondary"} onClick={buscarAseguradoHandler}>
                    {buscar.isFetching ? <Spinner animation="border" size="sm" /> : <FaSearch />}
                  </Button>
                </InputGroup.Append>
                <Form.Control.Feedback type="invalid">{
                  (buscar.error as any)?.response?.status == 404 ? "Asegurado no encontrado" :
                  "Ocurrio un error al realizar la busqueda"
                }</Form.Control.Feedback>
              </InputGroup>            
              {!formErrors.asegurado?.matricula && !buscar.isError ? <Form.Text id="matriculaHelpBlock" muted>Ej: 98-0824-ABC</Form.Text> : null}
            </Form.Group>
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
            {!!asegurado && <Form.Group as={Col} sm={3}>
              <Form.Label>Estado</Form.Label>
              <Form.Control
                readOnly
                className="text-uppercase"
                isInvalid={!!formErrors.asegurado?.estado}
                {...register("asegurado.estado")}
              >
              </Form.Control>
              <Form.Control.Feedback type="invalid">{formErrors.asegurado?.estado?.message}</Form.Control.Feedback>
            </Form.Group>}
            {asegurado?.tipo == 2 && <Form.Group as={Col} sm={3}>
              <Form.Label>Parentesco</Form.Label>
              <Form.Control
                readOnly
                className="text-uppercase"
                {...register("asegurado.parentesco")}
              />
            </Form.Group>}
            {asegurado?.afiliacion?.baja && <Form.Group as={Col} sm={3}>
              <Form.Label>Validez del seguro</Form.Label>
              <Form.Control
                readOnly
                isInvalid={!!formErrors.asegurado?.baja?.fechaValidezSeguro}
                {...register("asegurado.baja.fechaValidezSeguro")}
              />
              <Form.Control.Feedback type="invalid">{
                formErrors.asegurado?.baja?.fechaValidezSeguro?.message
              }</Form.Control.Feedback>
            </Form.Group>}
            {asegurado?.tipo == 2 ? <Form.Group as={Col} sm={3}>
              <Form.Label>Fecha de extinción</Form.Label>
              <Form.Control
                readOnly
                isInvalid={!!formErrors.asegurado?.fechaExtincion}
                {...register("asegurado.fechaExtincion")}
              />
              <Form.Control.Feedback type="invalid">{formErrors.asegurado?.fechaExtincion?.message}</Form.Control.Feedback>
            </Form.Group> : null}
          </Form.Row>
        </div>
        {asegurado?.tipo == 2 && <div /*className={asegurado.tipo == 2 ? "" : "d-none"}*/ >
          {/* {watch("titular.id") ? <> */}
          <hr />
          <h2 style={{ fontSize: "1.25rem" }}>Titular</h2>          
          {(formErrors.titular as any)?.message ? <Alert variant="danger">
            {(formErrors.titular as any)?.message}
          </Alert> : null}
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
                className="text-uppercase"
                isInvalid={!!formErrors.titular?.estado}
                {...register("titular.estado")}
              />
              <Form.Control.Feedback type="invalid">{formErrors.titular?.estado?.message}</Form.Control.Feedback>
            </Form.Group>
            {asegurado?.titular?.afiliacion?.baja && <Form.Group as={Col} sm={4}>
              <Form.Label>Validez del seguro</Form.Label>
              <Form.Control
                readOnly
                isInvalid={!!formErrors.titular?.baja?.fechaValidezSeguro}
                {...register("titular.baja.fechaValidezSeguro")}
              />
              <Form.Control.Feedback type="invalid">{formErrors.titular?.baja?.fechaValidezSeguro?.message}</Form.Control.Feedback>
            </Form.Group>}
          </Form.Row>
        </div>}
        {!!asegurado && <div>
          <hr />
          <h2 style={{ fontSize: "1.25rem"}}>Empleador</h2>
          {(formErrors.empleador as any)?.message ? <Alert variant="danger">
            {(formErrors.empleador as any)?.message}
          </Alert> : null}
          <Form.Row>
            <Form.Group as={Col} md={3}>
              <Form.Label>Nº Patronal</Form.Label>
              <Form.Control
                readOnly
                isInvalid={!!formErrors.empleador?.numeroPatronal}
                {...register("empleador.numeroPatronal")}
              />
              <Form.Control.Feedback type="invalid">{formErrors.empleador?.numeroPatronal?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md={9}>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                readOnly
                {...register("empleador.nombre")}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} sm={3}>
              <Form.Label>Estado</Form.Label>
              <Form.Control
                readOnly
                className="text-uppercase"
                isInvalid={!!formErrors.empleador?.estado}
                {...register("empleador.estado")}
              />
              <Form.Control.Feedback type="invalid">{formErrors.empleador?.estado?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} sm={3}>
              <Form.Label>Fecha de baja</Form.Label>
              <Form.Control
                readOnly
                isInvalid={!!formErrors.empleador?.fechaBaja}
                {...register("empleador.fechaBaja")}
              />
              <Form.Control.Feedback type="invalid">{formErrors.empleador?.fechaBaja?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} sm={3}>
              <Form.Label>En mora</Form.Label>
              <Form.Control
                readOnly
                className="text-uppercase"
                isInvalid={!!formErrors.empleador?.enMora}
                {...register("empleador.enMora")}
              />
              <Form.Control.Feedback type="invalid">{formErrors.empleador?.enMora?.message}</Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
        </div>}
        <AseguradoChooser
          title="Resultados"
          show={aseguradoChooserVisible}
          asegurados={buscar.data?.data.records || []}
          onSelect={(asegurado: Asegurado) => {
            // asegurado.matricula = watch("asegurado.matricula")
            props.onChange(asegurado)
            showAseguradoChooser(false)
          }}
          onHide={()=>showAseguradoChooser(false)}
        />
      </Card.Body>
    </Accordion.Collapse>
  </Card>
}