import React, { useState, useEffect, MutableRefObject } from "react"
import { Form, Modal, Row, Col, Button } from "react-bootstrap"
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as rules from "../../../../commons/components/rules"
import { EspecialidadesService } from "../services";

type Inputs = {
  archivo: FileList|null,
  separador: string,
  formatoSaltoLinea: string,
  aggrement: boolean
}
export const ImportarForm = ({modalRef}: {modalRef: MutableRefObject<{show: (visible: boolean)=>void}|undefined>})=>{
  const [visible, setVisible] = useState(false);

  const {
    register,
    formState,
    handleSubmit
  } = useForm<Inputs>({
    mode: "onBlur",
    defaultValues: {
      archivo: null,
      separador: ",",
      formatoSaltoLinea: "UNIX",
      aggrement: false
    }
  })

  const importFile = useMutation((vars: {archivo: File, separador: string, formatoSaltoLinea: string})=>{
    return EspecialidadesService.importar(vars.archivo, vars.separador, vars.formatoSaltoLinea)
  })

  useEffect(()=>{
    modalRef.current = {
      show: setVisible
    }
  }, [])
  return <Modal centered show={visible} onHide={()=>setVisible(false)}>
    <Modal.Header>
      Importar Datos
    </Modal.Header>
    <Modal.Body>
      <Form id="importar-especialidades-form" onSubmit={handleSubmit(({archivo, separador, formatoSaltoLinea})=>{
        importFile.mutate({
          archivo: archivo![0],
          separador,
          formatoSaltoLinea
        })
      })}>
        <Form.Group as={Row}>
          <Form.Label column sm={4}>Archivo</Form.Label>
          <Col className="d-flex align-items-center" sm={"auto"}>
            <Form.File
              isInvalid={!!formState.errors.archivo}
              {...register("archivo", {
                required: rules.required(),
              })}
              feedback={formState.errors.archivo?.message}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm={4}>Separador</Form.Label>
          <Col xs={"auto"}>
            <Form.Control className="text-center" maxLength={1} style={{width: "2.5rem"}}
              isInvalid={!!formState.errors.separador}
              {...register("separador", {
                required: rules.required()
              })}
            ></Form.Control>
            <Form.Control.Feedback type={"invalid"}>{formState.errors.separador?.message}</Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm={4}>Salto de linea</Form.Label>
          <Col className="d-flex" xs={"auto"}>
            <Form.Check inline type="radio" label="DOS" value="DOS" {...register("formatoSaltoLinea")}></Form.Check>
            <Form.Check inline type="radio" label="UNIX" value="UNIX" {...register("formatoSaltoLinea")}></Form.Check>
          </Col>
        </Form.Group>
        <Form.Check label="Entiendo los riesgos y he revisado cuidadosamente el contenido del archivo."
          isInvalid={!!formState.errors.aggrement}
          feedback={formState.errors.aggrement?.message}
          {...register("aggrement", {
            required: rules.required()
          })}
        ></Form.Check>
      </Form>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="danger" type="submit" form="importar-especialidades-form">Importar</Button>
        <Button>Cancelar</Button>
    </Modal.Footer>
  </Modal>
}