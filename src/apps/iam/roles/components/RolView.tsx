import { useEffect, useRef } from 'react'
import { AxiosError } from 'axios'
import { Alert, Button, Col, Form, Modal, Spinner, Table } from 'react-bootstrap'
import { RolService, Rol } from '../services'
import { useQuery, useMutation } from 'react-query'
import { FaEdit } from 'react-icons/fa'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useModal } from "../../../../commons/reusable-modal"


export const RolView = ()=>{
  const { pathname, state: locationState } = useLocation<{
    rol?: Rol
  }>()
  const { id } = useParams<{
    id: string
  }>()

  const queryLoader = useModal("queryLoader")

  const cargar = useQuery(["cargar", id], ()=>{
    return RolService.cargar(parseInt(id))
  }, {
    enabled: !locationState?.rol,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: () => {
      queryLoader.close()
    },
    onError: (error) => {
      queryLoader.open({
        state: "error",
        error
      })
    }
  })

  const eliminar = useMutation(()=>{
    return RolService.eliminar(parseInt(id))
  }, {
    onSuccess: () => {
      queryLoader.close()
    },
    onError: (error) => {
      queryLoader.open({
        state: error,
        error
      })
    }
  })

  const rol = cargar.data?.data || locationState?.rol

  useEffect(()=>{
    if(cargar.isFetching){
      queryLoader.open({
        state: "loading"
      })
    }
  }, [cargar.isFetching])

  
  return <>
    <h2 style={{fontSize: "1.75rem"}}>{rol?.name}</h2>
    <Table>
      <tbody>
        <tr>
          <th scope="row" style={{width: '1px'}}>Nombre</th>
          <td className="text-capitalize">{rol?.name}</td>
        </tr>
        <tr>
          <th className="text-nowrap" scope="row">Descripción</th>
          <td className={rol?.description ? "" : "bg-light"}>{rol?.description || "Sin descripción"}</td>
        </tr>
        <tr>
          <th scope="row">Fecha de creación</th>
          <td>{rol?.createdAt}</td>
        </tr>
        <tr>
          <th scope="row">Fecha de actualización</th>
          <td>{rol?.updatedAt}</td>
        </tr>
        <tr>
          <th scope="row">Permisos</th>
            <td className={`d-flex ${rol?.permissionNames.length ? "" : "bg-light"}`}>{
              rol?.permissionNames.length ? 
              <ul className="d-inline-block">{rol?.permissionNames.map((p, i)=><li key={i} className="text-capitalize">{p}</li>)}</ul> :
              "No se agregaron permisos"
            }
              {/* <Button className="btn-icon ml-auto mb-auto" style={{top: 0, right: 0}} variant="link" onClick={()=>{
                      //refetch()
              }}><FaEdit /></Button> */}
            </td>
        </tr>
      </tbody>
    </Table>
    {rol ? <Form.Row>
      <Col xs="auto">
        <Button as={Link} to={{
          pathname: `/iam/roles/${rol.id}/editar`,
          state: {
            rol
          }
        }} >Editar</Button>
      </Col>
      <Col xs="auto">
        <Button variant="danger" onClick={()=>{
          queryLoader.open({
            state: "loading"
          })
          eliminar.mutate()
        }}>
          {eliminar.isLoading ? <Spinner className="mr-2" animation="border" size="sm" /> : null}
          Eliminar
        </Button>
      </Col>
    </Form.Row> : null}
  </>
}