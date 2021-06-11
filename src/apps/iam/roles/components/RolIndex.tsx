import { AxiosPromise, AxiosError } from "axios"
import React, {useState, useRef} from "react"
import { Alert, Dropdown, ButtonGroup, Button, Form, Modal, Table, Spinner, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useQuery, useMutation } from "react-query"
import { FaSync, FaFilter, FaPlus } from "react-icons/fa"
import { Page, PaginatedResponse } from "../../../../commons/services"
// import { RolFilterForm } from "./RolFilterForm"
import { ImperativeModal, ImperativeModalRef, Pagination, VerticalEllipsisDropdownToggle } from "../../../../commons/components"
import { ProtectedContent } from "../../../../commons/auth/components"
import { useLoggedUser } from "../../../../commons/auth/hooks"
import { Rol, RolService, RolFilter } from "../services"
import { RolPolicy } from "../policies"

export const RolIndex = ()=>{

  const loggedUser = useLoggedUser()

  const [total, setTotal] = useState(0)
  const [page, setPage] = useState<Page>({
    current: 1,
    size: 10
  })

  const [filter, setFilter] = useState<RolFilter>({})

  const [showFilterForm, setShowFilterForm] = useState(false)

  const modalRef = useRef<ImperativeModalRef>(null)

  const buscar = useQuery(["roles.buscar", page, filter], ()=>{
    return RolService.buscar(filter, page) as AxiosPromise<PaginatedResponse<Rol>>
  }, {
    enabled: RolPolicy.view(loggedUser),
    // refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onSuccess: ({data: {meta}}) => {
      setTotal(meta.total)
    }
  })

  const eliminar = useMutation((id: number)=>{
    return RolService.eliminar(id)
  }, {
    onSuccess: ()=>{
      buscar.refetch()
      modalRef.current?.show(false)
    }
  })

  const renderModalHeader = ()=>{
    if(eliminar.isLoading){
      return "Eliminando"
    }
    if(eliminar.isError){
      return "Error"
    }
    return null
  }

  const renderModalBody = ()=>{
    if(eliminar.isLoading){
      return <>
        <Spinner animation="border" size="sm"></Spinner>
        <span className="ml-2">Espere un momento</span>
      </>
    }
    if(eliminar.isError){
      return <Alert variant="danger">
        Ocurrio un error mientras se eliminaba el rol
      </Alert>
    }
    return null
  }

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
    if(buscar.data){
      const records = buscar.data.data.records
      if(records.length == 0){
        return  <tr>
          <td className="bg-light text-center" colSpan={100}>
            No se encontraron resultados
          </td>
      </tr>
      }
      return records.map((rol, index)=>{
        return <tr key={rol.id}>
          <td>{index + 1}</td>
          <td className="text-capitalize">{rol.name}</td>
          <td>{rol.description}</td>
          <td>
            <Dropdown>
              <Dropdown.Toggle as={VerticalEllipsisDropdownToggle}
                variant="link" id={`dropdown-users-${rol.id}`}
              />
              <Dropdown.Menu>
                <ProtectedContent
                  authorize={RolPolicy.view}
                >
                  <Dropdown.Item as={Link} to={{
                    pathname: `/iam/roles/${rol.id}`,
                    state: {
                      rol
                    }
                  }} >Ver</Dropdown.Item>
                </ProtectedContent>
                <ProtectedContent
                  authorize={RolPolicy.edit}
                >
                  <Dropdown.Item as={Link} to={{
                    pathname: `/iam/roles/${rol.id}/editar`,
                    state: {
                      rol
                    }
                  }}>Editar</Dropdown.Item>
                </ProtectedContent>
                <ProtectedContent
                  authorize={RolPolicy.delete}
                >
                  <Dropdown.Item className="text-danger" onClick={()=>{
                    if(window.confirm("Esta accion es irreversible, ¿Esta seguro de continuar?")){
                      eliminar.mutate(rol.id)
                      modalRef.current?.show(true)
                    }
                  }}>Eliminar</Dropdown.Item>
                </ProtectedContent>
              </Dropdown.Menu>
            </Dropdown>
          </td>
        </tr>
      })
    }
  }

  return <div className="px-1">
    <h2 style={{fontSize: "1.75rem"}}>Roles</h2>
    <ImperativeModal ref={modalRef}>
      <Modal.Header>
        {renderModalHeader()}
      </Modal.Header>
      <Modal.Body>
        {renderModalBody()}
      </Modal.Body>
    </ImperativeModal>
    <div className="d-flex my-2">
      <Row className="ml-auto flex-nowrap" >
        <ProtectedContent
          authorize={RolPolicy.view}
        >
          <Col className={"pr-0"} xs="auto" >
            <Button onClick={()=>{
              buscar.refetch()
            }}><FaSync /></Button>
          </Col>
          <Col className={"pr-0"} xs="auto" >
            <Button onClick={()=>{
              // showUserFilterForm(visible=>!visible)
            }}><FaFilter /></Button>
          </Col>
        </ProtectedContent>
        <ProtectedContent
          authorize={RolPolicy.register}
        >
          <Col xs="auto">
            <Button
              as={Link}
              to={`/iam/roles/registrar`}
              className="d-flex align-items-center">
                <FaPlus className="mr-2" />Nuevo
            </Button>
          </Col>
        </ProtectedContent>
      </Row>
    </div>
    <ProtectedContent
      authorize={RolPolicy.view}
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
            <th>Nombre</th>
            <th>Descripcion</th>
            <th style={{width: 1}}></th>
          </tr>
        </thead>
        <tbody>
          {renderRows()}
        </tbody>
      </Table>
      <div className="row">
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
      </div>
    </ProtectedContent>
  </div>
}