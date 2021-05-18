import { useEffect, useState } from "react"
import { Alert, Modal as BSModal, Spinner } from "react-bootstrap"
import { useSelector } from "react-redux"

export const QueryProgressModal = ()=>{
  //@ts-ignore
  const modal = useSelector((state)=>state.modals.queryLoader)

  const renderModalHeader = ()=>{
    if(modal.state == "loading"){
      return "Procesando"
    }
    if(modal.state == "error"){
      return "Error"
    }
    return null
  }

  const renderModalBody = ()=>{
    if(modal.state == "loading"){
      return <>
        <Spinner animation="border"></Spinner>
        <span className="ml-2 align-middle">Espere un momento</span>
      </>
    }
    if(modal.state == "error"){
      return <Alert variant="danger">
        Ocurrio un error mientras se procesaba su solicitud
      </Alert>
    }
    return null
  }

  return <BSModal centered show={show} onHide={()=>{
    if(modal.state !== "loading") modal.close()
  }}>
    <BSModal.Header>
      {renderModalHeader()}
    </BSModal.Header>
    <BSModal.Body>
      {renderModalBody()}
    </BSModal.Body>
  </BSModal>
}