import { AxiosError, AxiosPromise } from "axios"
import { useEffect, useRef, useState } from "react"
import { Button, Col, Collapse, Form, Row, Spinner, Table } from "react-bootstrap"
import { FaFilter, FaSync, FaPlus } from "react-icons/fa"
import { useQuery } from "react-query"
import { Link, useLocation } from "react-router-dom"
import { Pagination } from "../../../../commons/components"
import { ProtectedContent, useLoggedUser, Permisos } from "../../../../commons/auth"
import { PaginatedResponse } from "../../../../commons/services"
import { MedicoPolicy } from "../policies"
import { Medico, MedicosService, MedicoFilter as Filter } from "../services"
import { MedicosFilterForm } from "./MedicosFilterForm"
import { RowOptions } from "./RowOptions"

export const MedicosIndex = () => {
  const {pathname: path} = useLocation()
  const [page, setPage] = useState({
    current: 1,
    size: 10
  })

  const loggedUser = useLoggedUser();
  
  const getDefaultFilter = ()=>{
    const filter: Filter = {  }
    if(!loggedUser.can(Permisos.VER_MEDICOS)){
      if(loggedUser.can(Permisos.VER_MEDICOS_REGIONAL)){
        filter.regionalId = loggedUser.regionalId;
      }
    }
    return filter
  }
  const [filter, setFilter] = useState<Filter>(getDefaultFilter)
  
  const [filterFormVisible, showFilterForm] = useState(false)

  const queryKey = ["medicos.buscar", filter, page];
  const buscar = useQuery(queryKey, () => {
    return MedicosService.buscar(filter, page) as AxiosPromise<PaginatedResponse<Medico>>
  }, {
    enabled: MedicoPolicy.view(loggedUser),
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
    if (buscar.isError) {
      const error = buscar.error as AxiosError
      return <tr>
        <td className="bg-danger text-light text-center" colSpan={100}>
          {error.response?.data?.message || error.message}
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
      return records.map((medico, index) => {
        return <tr key={medico.id}>
          <th scope="row">
            {index + 1}
          </th>
          <td>
            {medico.ciText}
          </td>
          <td>
            {medico.nombreCompleto}
          </td>
          <td>
            {medico.especialidad}
          </td>
          <td>
            {medico.estadoText}
          </td>
          <td>
            <RowOptions queryKey={queryKey} medico={medico} />
          </td>
        </tr>
      })
    }
  }

  
  return <div className="px-1">
    <h1 style={{fontSize: "1.75rem"}}>Medicos</h1>
    <div className="d-flex my-2">
      <Form.Row className="ml-auto flex-nowrap" >
        <ProtectedContent
          authorize={MedicoPolicy.view}
        >
          <Col xs="auto" >
            <Button onClick={()=>{
              buscar.refetch()
            }}><FaSync /></Button>
          </Col>
          <Col xs="auto" >
            <Button onClick={()=>{
              showFilterForm(visible=>!visible)
            }}><FaFilter /></Button>
          </Col>
        </ProtectedContent>
        <ProtectedContent
          authorize={MedicoPolicy.register}
        >
          <Col xs="auto">
            <Button
              as={Link}
              to={`${path}/registrar`}
              className="d-flex align-items-center">
                <FaPlus className="mr-1" /><span>Nuevo</span>
            </Button>
          </Col>
        </ProtectedContent>
      </Form.Row>
    </div>
    <ProtectedContent
      authorize={MedicoPolicy.view}
    >
      <Collapse in={filterFormVisible}>
        <div>
          <MedicosFilterForm onFilter={(filter)=>{
            setFilter({...filter, ...getDefaultFilter()})
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
            <th>C.I.</th>
            <th>Nombre</th>
            <th>Especialidad</th>
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