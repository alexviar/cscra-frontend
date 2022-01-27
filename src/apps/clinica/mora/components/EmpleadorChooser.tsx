import React, { forwardRef, useImperativeHandle, useRef, useCallback } from "react"
import { Button, Modal, ModalProps, Table } from "react-bootstrap"
import { Empleador } from "../services"

type Props = Omit<ModalProps, "children"> & {
  empleadores: Empleador[]
  onSelect: (Empleador: Empleador) => void
  title?: string
}

export const EmpleadorChooser = (props: Props) => {
  return <Modal {...props} >
    <Modal.Header>
      {props.title||"Empleadores"}
    </Modal.Header>
    <Modal.Body>
      <Table responsive className="small">
        <thead>
          <tr>
            <th style={{width: 1}}>#</th>
            <th>ID</th>
            <th>Número patronal</th>
            <th>Razón social</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!!props.empleadores.length ? props.empleadores.map((empleador, index)=>{
            return <tr key={empleador.id}>
              <th scope="row">{index+1}</th>
              <td>{empleador.id}</td>
              <td>{empleador.numeroPatronal}</td>
              <td>{empleador.nombre}</td>
              <td><Button onClick={()=>{
                props.onSelect(empleador)
              }}
              >Seleccionar</Button></td>
            </tr>
          }) : <tr><td className="bg-light text-center" colSpan={100}>No se encontraron resultados</td></tr>}
        </tbody>
      </Table>
    </Modal.Body>
  </Modal>
}