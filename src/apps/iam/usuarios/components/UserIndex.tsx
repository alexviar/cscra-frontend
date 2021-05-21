import { AxiosError } from "axios"
import React, {useState, useRef, useEffect} from "react"
import { Alert, Dropdown, Button, Form, Modal, Table, Spinner, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useQuery } from "react-query"
import { FaSync, FaFilter, FaUserPlus } from "react-icons/fa"
import { RowOptions } from "./RowOptions"
import { Page } from "../../../../commons/services"
import { Pagination } from "../../../../commons/components"
import { ProtectedContent } from "../../../../commons/auth/components"
import { Permisos } from "../../../../commons/auth/constants"
import { useLoggedUser } from "../../../../commons/auth/hooks"
import { User, UserService, UserFilter } from "../services"
import { UsuarioPolicy } from "../policies"


export const UserIndex = ()=>{

  const loggedUser = useLoggedUser()

  const [page, setPage] = useState<Page>({
    current: 1,
    size: 10
  })

  const [filter, setFilter] = useState<UserFilter>({})

  const [showFilterForm, setShowFilterForm] = useState(false)

  const queryKey = "usuarios.buscar"
  const buscar = useQuery(queryKey, ()=>{
    if(loggedUser.can(Permisos.VER_USUARIOS_DE_LA_MISMA_REGIONAL_QUE_EL_USUARIO, false)){
      filter.regionalId = loggedUser.regionalId
    }
    return UserService.buscar(filter, page)
  }, {
    enabled: UsuarioPolicy.view(loggedUser),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const total = buscar.data?.data?.meta?.total || 0

  const didMountRef = useRef(false)
  useEffect(()=>{
    if(!didMountRef.current) {
      didMountRef.current = true
      return
    }
    if(UsuarioPolicy.view(loggedUser)) buscar.refetch()
  }, [page, filter, loggedUser])

  const renderRows = ()=>{
    if (buscar.isFetching) {
      return <tr>
        <td className="bg-light text-center" colSpan={100}>
          <Spinner className="mr-2" variant="primary" animation="border" size="sm" />
          Cargando
        </td>
      </tr>
    }
    if (buscar.isError) {
      const { error } = buscar
      return <tr>
        <td className="bg-danger text-light text-center" colSpan={100}>
          {(error as AxiosError).response?.data?.message || (error as AxiosError).message}
        </td>
      </tr>
    }
    if (buscar.data){
      const records = buscar.data.data.records
      if(records.length == 0){
        return  <tr>
          <td className="bg-light text-center" colSpan={100}>
            No se encontraron resultados
          </td>
      </tr>
      }
      return records.map((user, index)=>{
        return <tr key={user.id}>
          <td>{index + 1}</td>
          <td>{user.ci} - {user.nombreCompleto}</td>
          <td>{user.username}</td>
          <td>{user.estado ? "Activo" : "Bloqueado"}</td>
          <td>
            <RowOptions user={user} />
          </td>
        </tr>
      })
    }
  }

  return <div className="px-1">
    <h2 style={{fontSize: "1.75rem"}}>Usuarios</h2>
    <div className="d-flex my-2">
      <Form.Row className="ml-auto flex-nowrap" >
        <ProtectedContent
          authorize={UsuarioPolicy.view}
        >
          <Col xs="auto" >
            <Button onClick={()=>{
              buscar.refetch()
            }}><FaSync /></Button>
          </Col>
          {/* <Col xs="auto" >
            <Button onClick={()=>{
              // showUserFilterForm(visible=>!visible)
            }}><FaFilter /></Button>
          </Col> */}
        </ProtectedContent>
        <ProtectedContent
          authorize={UsuarioPolicy.register}
        >
          <Col xs="auto">
            <Button
              as={Link}
              to={`/iam/usuarios/registrar`}
              className="d-flex align-items-center">
                <FaUserPlus className="mr-2" />Nuevo
            </Button>
          </Col>
        </ProtectedContent>
      </Form.Row>
    </div>
    <ProtectedContent
      authorize={UsuarioPolicy.view}
    >
      <Row>
        <Col className="mb-2">
          {/* <UserFilterForm onApply={(filter)=>{
            setFilter(filter)
          }} /> */}
        </Col>
        <Col className="mb-2" xs={"auto"}>
          <div className="d-flex flex-row flex-nowrap align-items-center">
              <span>Mostrar</span>
              <Form.Control className="mx-2" as="select" value={page.size} onChange={(e) => {
                const value = e.target.value
                setPage((page) => ({
                  current: 1,
                  size: parseInt(value)
                }))
              }}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Form.Control>
              <span>filas</span>
          </div>
        </Col>
      </Row>
      <Table responsive>
        <thead>
          <tr>
            <th style={{width: 1}}>#</th>
            <th>Propietario</th>
            <th>Usuario</th>
            <th>Estado</th>
            <th style={{width: 1}}></th>
          </tr>
        </thead>
        <tbody>
          {renderRows()}
        </tbody>
      </Table>
      <Row>
        <Col>
          <span className="mr-auto">{`Se encontraron ${total} resultados`}</span>
        </Col>
        <Col>
          <Pagination
            current={page.current}
            total={Math.ceil((total - page.size) / page.size) + 1}
            onChange={(current) => setPage((page) => ({ ...page, current }))}
          />
        </Col>
      </Row>
    </ProtectedContent>
  </div>
}