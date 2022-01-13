import React, { forwardRef, useImperativeHandle, useRef, useCallback } from "react"
import { Button, Modal, ModalProps, Table } from "react-bootstrap"
import { Asegurado } from "../services"

type Props = Omit<ModalProps, "children"> & {
  asegurados: Asegurado[]
  onSelect: (asegurado: Asegurado) => void
  title: string
}

export const AseguradoChooser = (props: Props) => {
  return <Modal {...props} >
    <Modal.Header>
      {props.title}
    </Modal.Header>
    <Modal.Body>
      <Table responsive className="small">
        <thead>
          <tr>
            <th style={{width: 1}}>#</th>
            <th>Matricula</th>
            <th>Nombre completo</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!!props.asegurados.length ? props.asegurados.map((asegurado, index)=>{
            return <tr key={asegurado.id}>
              <th scope="row">{index+1}</th>
              <td>{asegurado.matricula}-{asegurado.matriculaComplemento}</td>
              <td>{asegurado.nombreCompleto}</td>
              <td className={asegurado.estadoText ? "" : "bg-ligth"}>{asegurado.estadoText || "Desconocido"}</td>
              <td><Button onClick={()=>{
                props.onSelect(asegurado)
              }}
              >Seleccionar</Button></td>
            </tr>
          }) : <tr><td className="bg-light text-center" colSpan={100}>No se encontraron resultados</td></tr>}
        </tbody>
      </Table>
    </Modal.Body>
  </Modal>
}