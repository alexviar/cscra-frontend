import { Alert, Button, Breadcrumb, Col, Form, Table } from 'react-bootstrap'
import Skeleton from "react-loading-skeleton"
import { useLocation, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { UserService, User } from '../services'
import 'react-loading-skeleton/dist/skeleton.css'

export const UserView = ()=>{
  const location = useLocation<{user?: User}>()
  const {id} = useParams<{
    id: string
  }>()

  const cargar = useQuery(["usuario", "cargar", id], ()=>{
    return UserService.cargar(parseInt(id))
  }, {
    initialData: location.state?.user && { status: 200, statusText: "OK", headers: {}, config: {}, data: location.state?.user },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const user = cargar.data?.data

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
    return null
  }

  return <>
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/iam/usuarios" }}>Usuarios</Breadcrumb.Item>
      <Breadcrumb.Item active>{id}</Breadcrumb.Item>
      <Breadcrumb.Item active>Detalles</Breadcrumb.Item>
    </Breadcrumb>
    {renderAlert()}
    <Table>
      <tbody>
        <tr>
          <th scope="row">Carnet de identidad</th>
          <td>: {user?user.ci.texto : <Skeleton />}</td>
        </tr>
        <tr>
          <th scope="row">Nombre completo</th>
          <td>: {user?user.nombreCompleto : <Skeleton />}</td>
        </tr>
        <tr>
          <th className="text-nowrap" scope="row" style={{width: '1px'}}>Nombre de usuario</th>
          <td>: {user?user.username : <Skeleton />}</td>
        </tr>
        <tr>
          <th scope="row">Estado</th>
          <td>: {user? (user.estado == 1 ? 'Habilitado' : user?.estado == 2 ? 'Inhabilitado' : '') : <Skeleton />}</td>
        </tr>
        <tr>
          <th scope="row">Creado el</th>
          <td>: {user?user.createdAt : <Skeleton />}</td>
        </tr>
        <tr>
          <th scope="row">Actualizado el</th>
          <td>: {user?user.updatedAt:<Skeleton />}</td>
        </tr>
        <tr>
          <th scope="row">Roles</th>
          <td className="text-capitalize">: {user ? user.roles?.map(r => r.name) : <Skeleton />}</td>
        </tr>
      </tbody>
    </Table>
    {user ? <Form.Row>
      <Col xs="auto">
        <Button as={Link} to={{
          pathname: `/iam/usuarios/${user.id}/editar`,
          state: {
            user
          }
        }} >Editar</Button>
      </Col>
      <Col xs="auto">
        <Button variant="danger">Bloquear</Button>
      </Col>
    </Form.Row> : null}
  </>
}