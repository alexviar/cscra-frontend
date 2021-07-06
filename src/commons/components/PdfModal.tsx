import { useEffect, useState } from "react"
import { AxiosError } from "axios"
import { Alert, Modal as BSModal, Spinner } from "react-bootstrap"
import { useModal } from "../reusable-modal"
import { PDFViewer } from "./PDFViewer"

export const modalKey = "pdfModal"

export const PdfModal = ()=>{
  //@ts-ignore
  const modal = useModal(modalKey)

  const renderModalHeader = ()=>{
    return modal.title
  }

  const renderModalBody = ()=>{
    return modal.url ? <PDFViewer url={modal.url} /> : null
  }

  return <BSModal centered show={modal.show} size="lg" onHide={()=>{
    modal.close()
  }}>
    <BSModal.Header>
      {renderModalHeader()}
    </BSModal.Header>
    <BSModal.Body>
      {renderModalBody()}
    </BSModal.Body>
  </BSModal>
}