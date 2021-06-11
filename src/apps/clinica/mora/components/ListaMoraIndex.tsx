import { AxiosError } from "axios"
import { useEffect, useRef, useState } from "react"
import { Button, Col, Form, Spinner, Table } from "react-bootstrap"
import { FaFilter, FaSync, FaPlus } from "react-icons/fa"
import { useQuery } from "react-query"
import { Link } from "react-router-dom"
import {Pagination} from "../../../../commons/components"
import { useLoggedUser, ProtectedContent, Permisos } from "../../../../commons/auth"
import { ListaMoraService, ListaMoraFilter as Filter } from "../services"
import { ListaMoraFilterForm } from "./ListaMoraFilterForm"
import { RowOptions } from "./RowOptions"
import { ListaMoraPolicy } from "../policies"

export default () => {
  const [page, setPage] = useState({
    current: 1,
    size: 10
  })

  const loggedUser = useLoggedUser();
  
  const getDefaultFilter = ()=>{
    const filter: Filter = {}
    if(!loggedUser.can(Permisos.VER_LISTA_DE_MORA)){
      if(loggedUser.can(Permisos.VER_LISTA_DE_MORA_REGIONAL)){
        filter.regionalId = loggedUser.regionalId;
      }
    }
    return filter
  }

  const [filter, setFilter] = useState<Filter>(getDefaultFilter)

  const [filterFormVisible, showFilterForm] = useState(false)

  const queryKey = ["listaMora.buscar", filter, page]
  const buscar = useQuery(queryKey, () => {
    return ListaMoraService.buscar(filter, page)
  }, {
    enabled: ListaMoraPolicy.view(loggedUser),
    // refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const total = buscar.data?.data?.meta?.total || 0
  
  // const didMountRef = useRef(false)
  // useEffect(()=>{
  //   if(!didMountRef.current) {
  //     didMountRef.current = true
  //     return
  //   }
  //   if(ListaMoraPolicy.view(loggedUser)) buscar.refetch()
  // }, [page, filter, loggedUser])

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
      const { error } = buscar
      return <tr>
        <td className="bg-danger text-light text-center" colSpan={100}>
          {(error as AxiosError).response?.data?.message || (error as AxiosError).message}
        </td>
      </tr>
    }    
    const records = buscar.data!.data.records
    if(records.length == 0){
      return  <tr>
        <td className="bg-light text-center" colSpan={100}>
          No se encontraron resultados
        </td>
    </tr>
    }
    return records.map((item, index) => {
      return <tr key={item.id}>
        <td style={{ lineHeight: "26px" }}>
          {index + 1}
        </td>
        <td style={{ lineHeight: "26px" }}>
          {item.numeroPatronal}
        </td>
        <td style={{ lineHeight: "26px" }}>
          {item.nombre}
        </td>
        <td>
          <RowOptions item={item} queryKey={queryKey} />
        </td>
      </tr>
    })
  }

  return <div className="px-1">
    <h1 style={{ fontSize: "1.75rem" }}>Empleadores en mora</h1>
    <div className="d-flex my-2">
      <Form.Row className="ml-auto flex-nowrap">
        <ProtectedContent
          authorize={ListaMoraPolicy.view}
        >
          <Col xs="auto" >
            <Button className="my-2" onClick={() => {
              buscar.refetch()
            }}><FaSync /></Button>
          </Col>
          <Col xs="auto" >
            <Button className="my-2" onClick={() => {
              showFilterForm(visible => !visible)
            }}><FaFilter /></Button>
          </Col>
        </ProtectedContent>
        <ProtectedContent
          authorize={ListaMoraPolicy.agregar}
        >
          <Col xs="auto">
            <Button as={Link}
              to="/clinica/lista-mora/agregar"
              className="my-2"
            >
              <FaPlus className="mr-1" />
              Agregar
            </Button>
          </Col>
        </ProtectedContent>
      </Form.Row>
    </div>
    <ProtectedContent
      authorize={ListaMoraPolicy.view}
    >
    <Form.Row className="mb-2">
      <Col>
        <ListaMoraFilterForm
          onApply={(filter) => {
            setFilter(filter)
          }}
        />
      </Col>
      <Col xs="auto">
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
      </Col>
    </Form.Row>
    <Table responsive className="text-nowrap">
      <thead>
        <tr>
          <th style={{ width: 1 }}>#</th>
          <th style={{ width: 1 }}>Nº Patronal</th>
          <th >Nombre</th>
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