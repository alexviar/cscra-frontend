
import { useState, useEffect } from "react"
import { Alert, Form, Col, Modal, Row, Spinner } from "react-bootstrap"
import { useHistory, useParams } from "react-router"
import { useQuery } from "react-query"
import { ProveedorEmpresaForm } from "./ProveedorEmpresaForm"
import { ProveedorMedicoForm } from "./ProveedorMedicoForm"
import { Proveedor, ProveedoresService } from "../services"
import { ContactoForm } from "./ContactoForm"
import { ContratoForm } from "./ContratoForm"

export const ProveedorForm = ()=>{
  const [tipo, setTipo] = useState(0)
  const [step, setStep] = useState(1)
  const [showLoader, setShowLoader] = useState(false)
  const {id} = useParams<{
    id?: string
  }>()
  const history = useHistory<{
    proveedor: Proveedor,
    // step: number
  }>()

  const cargar = useQuery(["cargarProveedor",id], ()=>{
    return ProveedoresService.cargar(parseInt(id!))
  }, {
    enabled: !!id && !history.location.state?.proveedor,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })

  const proveedor = cargar.data?.data || history.location.state?.proveedor

  useEffect(()=>{
    if(proveedor){
      setTipo(proveedor.tipoId)
    }
  }, [proveedor])

  useEffect(()=>{
    if(cargar.isLoading){
      setShowLoader(true)
    }
  }, [cargar.isLoading])

  const renderLoader = () => {
    return <Modal centered show={showLoader} onHide={()=>{
      if(cargar.isError){
        setShowLoader(false)
      }
    }}>
      <Modal.Header>
        Cargando
      </Modal.Header>
      <Modal.Body>
        {cargar.isLoading ? <Spinner animation="border"></Spinner> : <Alert variant="danger">
          {cargar.error?.response?.message || cargar.error?.message}
        </Alert>}
      </Modal.Body>
    </Modal>
  }

  console.log(tipo, step)

  const renderForm = () => {
    if(tipo == 1) {
      return <ProveedorMedicoForm proveedor={proveedor}  
        next={()=>{
          if(!id){
            setStep(2)
          }
        }}
      />
    } 
    if(tipo == 2){
      return <ProveedorEmpresaForm proveedor={proveedor} 
        next={()=>{
          if(!id){
            setStep(2)
          }
        }}
      />
    }
    return null
  }

  if(step == 1){
    return <>
      <h1 style={{fontSize: "2rem"}}>{id ? "Actualizacion de Proveedor" : "Registro de Proveedor"}</h1>
      <Form.Group as={Row}>
        <Form.Label column sm={"auto"}>Tipo de proveedor</Form.Label>
        <Col className="d-flex" xs={"auto"}>
          <Form.Check disabled={!!id} inline type="radio" label="Médico" value={1} checked={tipo == 1} onChange={(e)=>{
            if(e.target.checked && !id)
              setTipo(1) 
          }} ></Form.Check>
          <Form.Check inline type="radio" label="Empresa" value={2} checked={tipo == 2} onChange={(e)=>{
            if(e.target.checked && !id)
              setTipo(2) 
          }} ></Form.Check>
        </Col>
      </Form.Group>
      {renderLoader()}
      {renderForm()}
    </>
  }
  if(step == 2){
    return <ContactoForm next={()=>{
      setStep(3)
    }}/>
  }
  if(step == 3){
    return <ContratoForm next={()=>{
      history.replace(`/clinica/proveedores/${history.location.state!.proveedor.id}`)
    }} />
  }
  return null

}