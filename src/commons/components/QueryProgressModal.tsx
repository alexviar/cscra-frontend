import { useEffect, useState } from "react"
import { AxiosError } from "axios"
import { Alert, Modal as BSModal, Spinner } from "react-bootstrap"
import { useModal } from "../reusable-modal"

export const QueryProgressModal = ()=>{
  //@ts-ignore
  const modal = useModal("queryLoader")

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
        <Spinner variant="primary" animation="border" size="sm"></Spinner>
        <span className="ml-2 align-middle">Espere un momento</span>
      </>
    }
    if(modal.state == "error"){
      return <Alert variant="danger">
        {errorMessage()}
      </Alert>
    }
    return null
  }
  
  const errorMessage = () =>{
    const status = modal.error?.response?.status
    switch(status){
      case 403: return "No tiene los permisos para realizar esta accion"
      default: return modal.error?.response?.data?.message || "Ocurrio un error mientras se procesaba su solicitud"
    }
  }

  return <BSModal centered show={modal.show} onHide={()=>{
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