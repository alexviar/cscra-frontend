import React, { forwardRef, useImperativeHandle, useRef, useCallback } from "react"
import { Button, Modal, ModalProps, Table } from "react-bootstrap"
import { PDFViewer } from "../../../../commons/components"
import { ImperativeModal, ImperativeModalRef } from "../../../../commons/components/ImperativeModal"
import { nombreCompleto } from "../../../../commons/utils/nombreCompleto"
import { Asegurado } from "../services/AseguradosService"

type Props = Omit<ModalProps, "children"> & {
  asegurados: Asegurado[]
  onSelect: (asegurado: Asegurado) => void
  title: string
}


export const AseguradoChooser = forwardRef<ImperativeModalRef, Props>((props, ref) => {
  console.log(props.asegurados.length)
  return <ImperativeModal {...props} ref={ref}>
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
              <td>{asegurado.matricula}</td>
              <td>{nombreCompleto(asegurado.apellidoPaterno, asegurado.apellidoMaterno, asegurado.nombres)}</td>
              <td>{asegurado.estado ? "Alta" : "Baja"}</td>
              <td><Button onClick={()=>{
                console.log(asegurado)
                props.onSelect(asegurado)
              }}
              >Seleccionar</Button></td>
            </tr>
          }) : <tr><td className="bg-light text-center" colSpan={100}>No se encontraron resultados</td></tr>}
        </tbody>
      </Table>
    </Modal.Body>
  </ImperativeModal>
})