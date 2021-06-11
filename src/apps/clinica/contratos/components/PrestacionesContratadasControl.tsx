import { useEffect } from "react"
import { Button, Col, Form, ListGroup, Row } from "react-bootstrap"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import { FaTrash } from "react-icons/fa"
import { PrestacionesTypeahead } from "../../solicitud_atencion_externa/components/PrestacionesTypeahead"
import { Prestacion } from "../../prestaciones/services"
import { ArancelesControl } from "./ArancelesControl"

export type Inputs = {
  prestaciones: {
    id: string
    prestacion: Prestacion
  }[]
}

export const PrestacionesContratadasControl = ()=>{
  const {
    register,
    control,
    trigger,
    formState: { errors: formErrors },
    watch
  } = useFormContext<Inputs>()

  const {
    fields,
    append,
    remove
  } = useFieldArray({
    name: "prestaciones",
    control
  })

  return <div>
    <h2 style={{fontSize: "1.25rem"}}>Prestaciones contratadas</h2>
    <Form.Row>
      <Form.Group as={Col} xs={12}>
        <PrestacionesTypeahead
          id={`proveedor-contrato/prestaciones`}
          filterBy={(prestacion) => {
            const prestaciones = watch("prestaciones")
            return !prestaciones.some(p=>p.prestacion?.id == prestacion.id)
          }}
          selected={[]}
          onChange={(prestacion) => {
            if(prestacion.length){
              append({prestacion: prestacion[0]})
            }
          }}
        />
      </Form.Group>
    </Form.Row>
    <div  className="mb-3" style={{maxHeight: 240, overflowY: "auto"}}>
      <ListGroup className={formErrors.prestaciones ? "is-invalid" : ""}>
        {fields.map((field, index)=>{
          return <ListGroup.Item key={field.id} className={"py-1 px-2"}>
            <Form.Row>
              <Col className="d-flex align-items-center">
                {field.prestacion.nombre}
              </Col>
              <Col className="d-flex align-items-center" xs={"auto"}>
                <Button variant="danger" onClick={() => remove(index)}><FaTrash/></Button>
              </Col>
            </Form.Row>
          </ListGroup.Item>
        })}
      </ListGroup>
      <Form.Control.Feedback type="invalid">{
        //@ts-ignore
        formErrors.prestaciones?.message}</Form.Control.Feedback>
    </div>
  </div>
}