import { useEffect, useRef } from 'react'
import { AxiosError } from 'axios'
import { Alert, Breadcrumb, Button, Col, Form, Modal, Spinner, Table } from 'react-bootstrap'
import { RolService, Rol } from '../services'
import { useQueryClient, useQuery, useMutation } from 'react-query'
import { FaEdit } from 'react-icons/fa'
import { Link, useLocation, useParams } from 'react-router-dom'
import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'


export const RolView = ()=>{
  const location = useLocation<{
    rol?: Rol
  }>()
  const { id } = useParams<{
    id: string
  }>()

  const queryClient = useQueryClient()

  const cargar = useQuery(["roles", "cargar", id], ()=>{
    return RolService.cargar(parseInt(id))
  }, {
    initialData: location.state?.rol && { status: 200, statusText: "OK", headers: {}, config: {}, data: location.state?.rol },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const eliminar = useMutation(()=>{
    return RolService.eliminar(parseInt(id))
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(["roles", "buscar"]);
    },
    onError: (error) => {
    }
  })

  const rol = cargar.data?.data

  const renderAlert = () => {
    if (cargar.error) {
      const { response } = cargar.error as any
      return <Alert variant="danger">
        {
          !response ? 
            "No fue posible realizar la solicitud, verifique si tiene conexion a internet" :
            response.status == 404 ? 
              "El usuario que busca no existe" :
              "Ocurrio un error inesperado"
        }
      </Alert>
    }
    if(eliminar.status == "success") {
      return <Alert variant="success">
        El rol ha sido eliminado.
      </Alert>
    }
    if(eliminar.status == "error") {
      return <Alert variant="danger">
        Ocurrio un error mientras se intentaba eliminar el rol.
      </Alert>
    }
    return null
  }
  
  return <>
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/iam/roles" }}>Roles</Breadcrumb.Item>
      <Breadcrumb.Item active>{id}</Breadcrumb.Item>
      <Breadcrumb.Item active>Detalles</Breadcrumb.Item>
    </Breadcrumb>
    {renderAlert()}
    <Table>
      <tbody>
        <tr>
          <th scope="row" style={{width: '1px'}}>Nombre</th>
          <td className="text-capitalize">{rol?rol.name: <Skeleton />}</td>
        </tr>
        <tr>
          <th className="text-nowrap" scope="row">Descripción</th>
          <td className={rol?.description ? "" : "bg-light"}>{rol?rol.description || "Sin descripción": <Skeleton />}</td>
        </tr>
        <tr>
          <th scope="row">Fecha de creación</th>
          <td>{rol?rol.createdAt:<Skeleton />}</td>
        </tr>
        <tr>
          <th scope="row">Fecha de actualización</th>
          <td>{rol?rol.updatedAt: <Skeleton />}</td>
        </tr>
        <tr>
          <th scope="row">Permisos</th>
            <td className={`d-flex ${rol?.permissions.length ? "" : "bg-light"}`}>{
              rol ? rol.permissions.length ? <ul className="d-inline-block">
                {rol?.permissions.map((p, i)=><li key={p.id} className="text-capitalize">{p.name}</li>)}
              </ul> : "No se agregaron permisos" : <Skeleton count={5} />
            }
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
          if(window.confirm("Esta accion es irreversible, ¿Esta seguro de continuar?")){
            eliminar.mutate()
          }
        }}>
          {eliminar.isLoading ? <Spinner className="mr-2" animation="border" size="sm" /> : null}
          Eliminar
        </Button>
      </Col>
    </Form.Row> : null}
  </>
}