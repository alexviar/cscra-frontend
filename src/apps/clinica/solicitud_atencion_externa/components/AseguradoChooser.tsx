import React, { forwardRef, useImperativeHandle, useRef, useCallback } from "react"
import { Modal, ModalProps, Table } from "react-bootstrap"
import { PDFViewer } from "../../../../commons/components"
import { ImperativeModal, ImperativeModalRef } from "../../../../commons/components/ImperativeModal"
import { nombreCompleto } from "../../../../commons/utils/nombreCompleto"
import { Asegurado } from "../services/AseguradosService"

type Props = Omit<ModalProps, "children"> & {
  asegurados: Asegurado[]
  onSelect: (id: string) => void
  title: string
}


export const AseguradoChooser = forwardRef<ImperativeModalRef, Props>((props, ref) => {

  return <ImperativeModal {...props} ref={ref}>
    <Modal.Header>
      {props.title}
    </Modal.Header>
    <Modal.Body>
      <Table>
        <thead>
          <tr>
            <td style={{width: 1}}>#</td>
            <td>Matricula</td>
            <td>Nombre completo</td>
            <td>Estado</td>
          </tr>
        </thead>
        <tbody>
          {props.asegurados.map((asegurado, index)=>{
            return <tr onClick={()=>{
              props.onSelect(asegurado.id)
            }}>
              <td>{index+1}</td>
              <td>{asegurado.matricula}</td>
              <td>{nombreCompleto(asegurado.apellidoPaterno, asegurado.apellidoMaterno, asegurado.nombres)}</td>
              <td>{asegurado.estado}</td>
            </tr>
          })}
        </tbody>
      </Table>
    </Modal.Body>
  </ImperativeModal>
})