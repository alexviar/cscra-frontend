
import { useState, useEffect } from "react"
import { Form, Col} from "react-bootstrap"
import { useHistory, useParams } from "react-router"
import { useQuery } from "react-query"
import { useModal } from "../../../../commons/reusable-modal"
import { Inputs as PEInputs, ProveedorEmpresaForm } from "./ProveedorEmpresaForm"
import { Inputs as ProveedorMedicoInput, ProveedorMedicoForm } from "./ProveedorMedicoForm"
import { Proveedor, ProveedoresService } from "../services"
import { ContactoForm } from "./ContactoForm"
import { ContratoForm } from "./ContratoForm"

export type { ProveedorMedicoInput }

export type Inputs = PEInputs | ProveedorMedicoInput

export const ProveedorForm = (props: { onSubmit?: (data: PEInputs | ProveedorMedicoInput) => void})=>{
  const [tipo, setTipo] = useState(0)
  const {id} = useParams<{
    id?: string
  }>()

  const history = useHistory<{
    proveedor: Proveedor
  }>()

  const loader = useModal("queryLoader")

  const cargar = useQuery(["proveedor.cargar", id], ()=>{
    return ProveedoresService.cargar(parseInt(id!))
  }, {
    enabled: !!id && !history.location.state?.proveedor,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onSuccess: ()=>{
      loader.close()
    },
    onError: (error) => {
      loader.open({
        state: "error",
        error
      })
    }
  })

  const proveedor = cargar.data?.data || history.location.state?.proveedor

  useEffect(()=>{
    if(proveedor){
      setTipo(proveedor.tipoId)
    }
  }, [proveedor])

  useEffect(()=>{
    if(cargar.isLoading){
      loader.open({
        state: "loading"
      })
    }
  }, [cargar.isLoading])

  const renderForm = () => {
    if(tipo == 1) {
      return <ProveedorMedicoForm proveedor={proveedor} 
        onSubmit={props.onSubmit}
      />
    } 
    if(tipo == 2){
      return <ProveedorEmpresaForm proveedor={proveedor}
        onSubmit={props.onSubmit}
      />
    }
    return null
  }

  return <>
    <h1 style={{fontSize: "1.75rem"}}>{id ? "Actualizacion de Proveedor" : "Registro de Proveedor"}</h1>
    <Form.Group as={Form.Row}>
      <Form.Label column sm={"auto"}>Tipo de proveedor</Form.Label>
      <Col className="d-flex" xs={"auto"}>
        <Form.Check disabled={!!id} inline type="radio" label="Médico" value={1} checked={tipo == 1} onChange={(e)=>{
          if(e.target.checked && !id)
            setTipo(1) 
        }} ></Form.Check>
        <Form.Check disabled={!!id}  inline type="radio" label="Empresa" value={2} checked={tipo == 2} onChange={(e)=>{
          if(e.target.checked && !id)
            setTipo(2) 
        }} ></Form.Check>
      </Col>
    </Form.Group>
    {renderForm()}
  </>
}