import { AxiosError } from "axios"
import { useEffect, useState, useRef } from "react"
import { Button, Col, Collapse, Form, Spinner, Table } from "react-bootstrap"
import { FaFilter, FaSync, FaPlus } from "react-icons/fa"
import { useQuery } from "react-query"
import { Link, useLocation, useParams } from "react-router-dom"
import { Pagination } from "../../../../commons/components"
import { ProtectedContent, useLoggedUser, Permisos } from "../../../../commons/auth"
import { ContratoPolicy } from "../policies"
import { ContratosService, Filter } from "../services"
import { ContratoFilterForm } from "./ContratoFilterForm"
import { RowOptions } from "./RowOptions"

export const ContratosIndex = () => {
  const { id: idProveedor } = useParams<{
    id: string
  }>()
  const { pathname: path } = useLocation()
  const [page, setPage] = useState({
    current: 1,
    size: 10
  })

  const loggedUser = useLoggedUser()

  const getDefaultFilter = () => {
    const filter: Filter = {}
    return filter
  }

  const [filter, setFilter] = useState<Filter>(getDefaultFilter)
  const [filterFormVisible, showFilterForm] = useState(false)

  const queryKey = ["contratos.buscar", idProveedor, filter, page]
  const buscar = useQuery(queryKey, () => {
    return ContratosService.buscar(parseInt(idProveedor), filter, page)
  }, {
    enabled: ContratoPolicy.view(loggedUser),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const total = buscar.data?.data?.meta?.total || 0

  const renderRows = () => {
    if (buscar.isFetching) {
      return <tr>
        <td className="bg-light text-center" colSpan={100}>
          <Spinner className="mr-2" variant="primary" animation="border" size="sm" />
          Cargando
        </td>
      </tr>
    }
    else if (buscar.isError) {
      const error = buscar.error as AxiosError
      return <tr>
        <td className="bg-danger text-light text-center" colSpan={100}>
          {error.response?.data?.message || error.message}
        </td>
      </tr>
    }
    if (buscar.data) {
      const records = buscar.data.data.records
      if (records.length == 0) {
        return <tr>
          <td className="bg-light text-center" colSpan={100}>
            No se encontraron resultados
          </td>
        </tr>
      }
      return records.map((item, index) => {
        return <tr key={item.id}>
          <th scope="row">{index + 1}</th>
          <td>{item.inicio}</td>
          <td>{item.fin || "Indefinido"}</td>
          <td>{item.extension}</td>
          <td>{item.estadoText}</td>
          <td><RowOptions contrato={item} queryKey={queryKey} /></td>
        </tr>
      })
    }
  }

  return <div className="px-1">
    <div className="d-flex my-2">
      <Form.Row className="ml-auto flex-nowrap" >
        <ProtectedContent
          authorize={ContratoPolicy.view}
        >
          <Col className={"pr-0"} xs="auto" >
            <Button onClick={() => {
              buscar.refetch()
            }}><FaSync /></Button>
          </Col>
          <Col className={"pr-0"} xs="auto" >
            <Button onClick={() => {
              showFilterForm(visible => !visible)
            }}><FaFilter /></Button>
          </Col>
        </ProtectedContent>
        <ProtectedContent
          authorize={ContratoPolicy.register}
        >
          <Col xs="auto">
            <Button
              as={Link}
              to={`/clinica/proveedores/${idProveedor}/contratos/registrar`}
              className="d-flex align-items-center">
              <FaPlus className="mr-2"/><span>Nuevo</span>
            </Button>
          </Col>
        </ProtectedContent>
      </Form.Row>
    </div>
    <ProtectedContent
      authorize={ContratoPolicy.view}
    >
      <Collapse in={filterFormVisible}>
        <div>
          <ContratoFilterForm onApply={(filter) => {
            setFilter(filter)
            setPage(page => ({...page, current: 1}))
          }} />
        </div>
      </Collapse>
      <div className="d-flex">
        <div className="ml-auto mb-2">
          <div className="d-flex flex-row flex-nowrap align-items-center">
            <span>Mostrar</span>
            <Form.Control className="mx-2" as="select" value={page.size} onChange={(e) => {
              const value = e.target.value
              setPage((page) => ({
                ...page,
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
        </div>
      </div>
      <Table responsive>
        <thead>
          <tr>
            <th style={{width: 1}}>#</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Extensión</th>
            <th>Estado</th>
            <th style={{width: 1}}></th>
          </tr>
        </thead>
        <tbody>
          {renderRows()}
        </tbody>
      </Table>
      {buscar.status === "success" ? <div className="d-flex flex-row">
        <span className="mr-auto">{`Se encontraron ${total} resultados`}</span>
        <Pagination
          current={page.current}
          total={Math.ceil((total - page.size) / page.size) + 1}
          onChange={(current) => setPage((page) => ({ ...page, current }))}
        />
      </div> : null}
    </ProtectedContent>
  </div>
}