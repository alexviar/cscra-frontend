import { useEffect } from 'react'
import { Alert, Breadcrumb, Table } from 'react-bootstrap'
import { Medico, MedicosService } from '../services'
import { useQuery, useMutation } from 'react-query'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useUser } from "../../../../commons/auth"
import { useModal } from "../../../../commons/reusable-modal"
import { medicoPolicy } from "../policies"

export const MedicoView = ()=>{
  const { pathname, state: locationState } = useLocation<{
    medico?: Medico
  }>()
  
  const { id } = useParams<{
    id: string
  }>()

  const user = useUser()

  const cargar = useQuery(["cargar", id], ()=>{
    return MedicosService.load(parseInt(id))
  }, {
    initialData: locationState?.medico && { status: 200, statusText: "OK", headers: {}, config: {}, data: locationState?.medico },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const medico = cargar.data?.data || locationState?.medico

  const renderAlert = () => {
    if(cargar.error) {
      const { response } = cargar.error as any
      return <Alert variant="danger">
        {
          !response ? "No fue posible realizar la solicitud, verifique si tiene conexion a internet" :
          response.status == 404 ? "El proveedor que busca no existe" : 
          "Ocurrio un error inesperado"
        }
      </Alert>
    }
    return null
  }
  
  return <div>
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{to: "/clinica/medicos"}}>Médicos</Breadcrumb.Item>
      <Breadcrumb.Item active>{id}</Breadcrumb.Item>
      <Breadcrumb.Item active>Detalles</Breadcrumb.Item>
    </Breadcrumb>
    {renderAlert()}
      <Table>
        <tbody>
          <tr>
            <th style={{width: 1}}>Carnet de identidad</th>
            <td>: {medico?.ci.texto}</td>
          </tr>
          <tr>
            <th style={{width: 1}}>Nombre</th>
            <td>: {medico?.nombreCompleto}</td>
          </tr>
          <tr>
            <th style={{width: 1}}>Regional</th>
            <td>: {medico?.regional}</td>
          </tr>
          <tr>
            <th style={{width: 1}}>Especialidad</th>
            <td>: {medico?.especialidad}</td>
          </tr>
        </tbody>
      </Table>
  </div>
}