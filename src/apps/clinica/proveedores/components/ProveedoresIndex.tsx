import { AxiosError } from "axios"
import { useEffect, useState, useRef } from "react"
import { Button, Col, Form, Spinner, Table } from "react-bootstrap"
import { FaFilter, FaSync, FaPlus } from "react-icons/fa"
import { useQuery } from "react-query"
import { Link, useLocation } from "react-router-dom"
import { Pagination } from "../../../../commons/components"
import { ProtectedContent, useLoggedUser, Permisos } from "../../../../commons/auth"
import { ProveedorPolicy } from "../policies"
import { ProveedoresService, Filter } from "../services"
import { ProveedoresFilterForm } from "./ProveedoresFilterForm"
import { RowOptions } from "./RowOptions"

export const ProveedoresIndex = () => {
  const { pathname: path } = useLocation()
  const [page, setPage] = useState({
    current: 1,
    size: 10
  })

  const loggedUser = useLoggedUser(

  )

  const getDefaultFilter = () => {
    const filter: Filter = {}
    if (!loggedUser.can(Permisos.VER_PROVEEDORES)) {
      if (loggedUser.can(Permisos.VER_PROVEEDORES_REGIONAL)) {
        filter.regionalId = loggedUser.regionalId;
      }
    }
    return filter
  }

  const [filter, setFilter] = useState<Filter>(getDefaultFilter)
  const [filterFormVisible, showFilterForm] = useState(false)

  const queryKey = ["proveedores.buscar", filter, page]
  const buscar = useQuery(queryKey, () => {
    return ProveedoresService.buscar(filter, page)
  }, {
    enabled: ProveedorPolicy.view(loggedUser),
    // refetchOnMount: false,
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
          <th scope="row" style={{ width: 1, lineHeight: "26px" }}>
            {index + 1}
          </th>
          <td style={{ lineHeight: "26px" }}>
            {item.nombre || item.nombreCompleto}
          </td>
          <td style={{ lineHeight: "26px" }}>
            {item.tipo}
          </td>
          <td>
            <RowOptions proveedor={item} queryKey={queryKey} />
          </td>
        </tr>
      })
    }
  }

  return <div className="px-1">
    <h1 style={{ fontSize: "1.75rem" }}>Proveedores</h1>
    <div className="d-flex my-2">
      <Form.Row className="ml-auto flex-nowrap" >
        <ProtectedContent
          authorize={ProveedorPolicy.view}
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
          authorize={ProveedorPolicy.register}
        >
          <Col xs="auto">
            <Button
              as={Link}
              to={`${path}/registrar`}
              className="d-flex align-items-center">
              <FaPlus /><span className="mr-2">Nuevo</span>
            </Button>
          </Col>
        </ProtectedContent>
      </Form.Row>
    </div>
    <ProtectedContent
      authorize={ProveedorPolicy.view}
    >
      <div className="mb-2">
        {filterFormVisible && <ProveedoresFilterForm onFilter={(filter) => {
          setFilter(filter)
        }} />}
      </div>
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
        <thead className="text-center">
          <tr>
            <th style={{ width: 1 }}>#</th>
            <th>Nombre</th>
            <th style={{ width: 1 }}>Tipo</th>
            <th style={{ width: 1 }}></th>
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