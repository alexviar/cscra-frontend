import { AxiosPromise, AxiosError } from "axios"
import React, {useState, useRef} from "react"
import { Alert, Dropdown, ButtonGroup, Button, Form, Modal, Table, Spinner, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useQuery, useMutation } from "react-query"
import { FaSync, FaFilter, FaPlus } from "react-icons/fa"
import { Page, PaginatedResponse } from "../../../../commons/services"
import { RolFilterForm } from "./RolFilterForm"
import { Pagination, VerticalEllipsisDropdownToggle } from "../../../../commons/components"
import { ProtectedContent } from "../../../../commons/auth/components"
import { useLoggedUser } from "../../../../commons/auth/hooks"
import { Rol, RolService, RolFilter } from "../services"
import { RolPolicy } from "../policies"
import { RowOptions } from "./RowOptions"

export const RolIndex = ()=>{

  const loggedUser = useLoggedUser()

  const [total, setTotal] = useState(0)
  const [page, setPage] = useState<Page>({
    current: 1,
    size: 10
  })

  const [filter, setFilter] = useState<RolFilter>({})

  const queryKey = ["roles.buscar", page, filter]
  const buscar = useQuery(queryKey, ()=>{
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
            <RowOptions rol={rol} queryKey={queryKey} />
          </td>
        </tr>
      })
    }
  }

  return <div className="px-1">
    <h2 style={{fontSize: "1.75rem"}}>Roles</h2>
    <div className="d-flex my-2">
      <Row className="ml-auto flex-nowrap" >
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
          <RolFilterForm onSearch={(filter)=>{
            setFilter({texto: filter})
          }} />
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