import { useEffect, useState } from "react"
import { Alert, Modal as BSModal, Spinner } from "react-bootstrap"
import { PDFViewer } from "../../../../commons/components"
import { useModal } from "../../../../commons/reusable-modal"

export const Dm11Viewer = ()=>{
  //@ts-ignore
  const modal = useModal("dm11Viewer")

  return <BSModal centered show={modal.show} size="lg" onHide={()=>{
    modal.close()
  }}>
    <BSModal.Header>
      D.M. - 11
    </BSModal.Header>
    <BSModal.Body>
      {modal.url ? <PDFViewer url={modal.url}/> : null}
    </BSModal.Body>
  </BSModal>
}