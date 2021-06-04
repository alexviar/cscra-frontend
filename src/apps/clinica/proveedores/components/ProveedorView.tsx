import { useEffect, useRef } from 'react'
import { AxiosError } from 'axios'
import { Alert, Button, Col, Form, Modal, Spinner, Tab, Table } from 'react-bootstrap'
import { Proveedor, ProveedoresService } from '../services'
import { useQuery, useMutation } from 'react-query'
import { FaEdit } from 'react-icons/fa'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useLoggedUser, ProtectedContent } from "../../../../commons/auth"
import { useModal } from "../../../../commons/reusable-modal"
import { ProveedorPolicy } from "../policies"


export const ProveedorView = ()=>{
  const { pathname, state: locationState } = useLocation<{
    proveedor?: Proveedor
  }>()
  const { id } = useParams<{
    id: string
  }>()

  const loggedUser = useLoggedUser()

  const loader = useModal("queryLoader")

  const cargar = useQuery(["cargar", id], ()=>{
    return ProveedoresService.cargar(parseInt(id))
  }, {
    enabled: !locationState?.proveedor,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: () => {
      loader.close()
    },
    onError: (error) => {
      loader.open({
        state: "error",
        error
      })
    }
  })

  // const eliminar = useMutation(()=>{
  //   return ProveedorService.eliminar(parseInt(id))
  // }, {
  //   onSuccess: () => {
  //     loader.close()
  //   },
  //   onError: (error) =>{
  //     loader.open({
  //       state: "error",
  //       error
  //     })
  //   }
  // })

  const proveedor = cargar.data?.data || locationState?.proveedor

  useEffect(()=>{
    if(cargar.isFetching){
      loader.open({state: "loading"})
    }
  }, [cargar.isFetching])

  // useEffect(()=>{
  //   if(eliminar.isLoading){
  //     loader.open({state: "loading"})
  //   }
  // }, [eliminar.isLoading])

  const renderGeneralInfo = ()=>{
    if(proveedor?.tipoId == 1){
      return <tbody>
        <tr>
          <th scope="row">Tipo</th>
          <td >Médico especialista</td>
        </tr>
        <tr>
          <th scope="row" style={{width: '1px'}}>Carnet de identidad</th>
          <td>{proveedor?.ciText}</td>
        </tr>
        <tr>
          <th scope="row" style={{width: '1px'}}>Nombre</th>
          <td>{proveedor?.nombreCompleto}</td>
        </tr>
        <tr>
          <th scope="row">Especialidad</th>
          <td>{proveedor?.especialidad?.nombre}</td>
        </tr>
      </tbody>
    }
    else if(proveedor?.tipoId == 2){
      return <tbody>
        <tr>
          <th scope="row">Tipo</th>
          <td >Empresa</td>
        </tr>
        <tr>
          <th scope="row" style={{width: '1px'}}>NIT</th>
          <td>{proveedor?.nit}</td>
        </tr>
        <tr>
          <th scope="row" style={{width: '1px'}}>Nombre</th>
          <td>{proveedor?.nombre}</td>
        </tr>
      </tbody>
    }
    return null
  }
  
  return <>
    <h2 style={{fontSize: "1.75rem"}}>Proveedor</h2>
    <div id="general-info">
      <Table>
        {renderGeneralInfo()}
      </Table>
      {proveedor ? <Form.Row>
        <ProtectedContent
          authorize={ProveedorPolicy.edit}
        >
          <Col xs="auto">
            <Button as={Link} to={{
              pathname: `/clinica/proveedores/${proveedor.id}/editar`,
              state: {
                proveedor
              }
            }} >Editar</Button>
          </Col>
        </ProtectedContent>
        {/* <Col xs="auto">
          <Button variant="danger" onClick={()=>{
            modalRef.current?.show(true)
            eliminar.mutate()
          }}>
            {eliminar.isLoading ? <Spinner className="mr-2" animation="border" size="sm" /> : null}
            Eliminar
          </Button>
        </Col> */}
      </Form.Row> : null}
    </div>
  </>
}