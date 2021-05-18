import { AxiosError } from "axios"
import { useRef, useState} from "react"
import { Button, Col, Dropdown, Form, Spinner, Table } from "react-bootstrap"
import {FaFilter, FaPlus, FaSync} from "react-icons/fa"
import { Link, useLocation } from "react-router-dom"
import { useMutation, useQuery } from "react-query"
import { Pagination } from "../../../../commons/components"
import { Page } from "../../../../commons/services/Page"
import { SolicitudesAtencionExternaFilter as Filter, SolicitudesAtencionExternaService } from "../services/SolicitudesAtencionExternaService"
import { SolicitudAtencionExternaFilterForm } from "./SolicitudAtencionExternaFilterForm"
import { Dm11Viewer } from "./Dm11Viewer"
import { Permisos } from "../../../../commons/auth/constants"
import { useLoggedUser } from "../../../../commons/auth/hooks"
import { ProtectedContent } from "../../../../commons/auth/components/ProtectedContent"
import { RowOptions } from "./RowOptions"
import { SolicitudATPolicy } from "../policies"

export const SolicitudAtencionExternaIndex = ()=>{
  const {pathname: path} = useLocation()
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState<Page>({
    current: 1,
    size: 10
  })

  const loggedUser = useLoggedUser();

  const getDefaultFilter = ()=>{
    const filter: Filter = {}
    if(!loggedUser.can(Permisos.VER_SOLICITUDES_DE_ATENCION_EXTERNA)){
      if(loggedUser?.can(Permisos.VER_SOLICITUDES_DE_ATENCION_EXTERNA_MISMA_REGIONAL)){
        filter.regionalId = loggedUser.regionalId;
      }
      if(loggedUser?.can(Permisos.VER_SOLICITUDES_DE_ATENCION_EXTERNA_REGISTRADO_POR)){
        filter.registradoPor = loggedUser.id;
      }
    }
    return filter
  }

  const [filter, setFilter] = useState<Filter>(getDefaultFilter)

  const buscar = useQuery(["solicitudesAtencionExterna.buscar", page, filter], ()=>{
    return SolicitudesAtencionExternaService.buscar({...filter, ...getDefaultFilter()}, page)
  }, {
    enabled: loggedUser.canAny([
      Permisos.VER_SOLICITUDES_DE_ATENCION_EXTERNA,
      Permisos.VER_SOLICITUDES_DE_ATENCION_EXTERNA_MISMA_REGIONAL,
      Permisos.VER_SOLICITUDES_DE_ATENCION_EXTERNA_REGISTRADO_POR,
    ]),
    refetchOnMount: false,
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
    if (buscar.data){
      const records = buscar.data!.data.records
      if(records.length === 0){
        return  <tr>
          <td className="bg-light text-center" colSpan={100}>
            No se encontraron resultados
          </td>
      </tr>
      }
      return records.map((solicitud, index)=>{
        return <tr key={solicitud.id}>
          <td>{index + 1}</td>
          <td>{solicitud.numero}</td>
          <td>{solicitud.fecha}</td>
          <td>{solicitud.asegurado.matricula}</td>
          <td>{solicitud.medico}</td>
          <td>{solicitud.proveedor}</td>
          <td>
            <RowOptions solicitud={solicitud} />
          </td>
        </tr>
      })
    }
  }

  return <div className="px-1">
    <h1 style={{fontSize: "1.75rem"}}>Solicitudes de atención externa</h1>
    <div className="d-flex my-2">
      <Form.Row className="ml-auto flex-nowrap" >
        <ProtectedContent
          authorize={SolicitudATPolicy.view}
        >
          <Col xs="auto" >
            <Button onClick={()=>{
              buscar.refetch()
            }}><FaSync /></Button>
          </Col>
          <Col xs="auto" >
            <Button onClick={()=>{
              // showUsersFilter(visible=>!visible)
            }}><FaFilter /></Button>
          </Col>
        </ProtectedContent>
        <ProtectedContent
          authorize={SolicitudATPolicy.register}
        >
          <Col xs="auto">
            <Button
              as={Link}
              to={`${path}/registrar`}
              className="d-flex align-items-center">
                <FaPlus className="mr-2" />Nuevo
            </Button>
          </Col>
        </ProtectedContent>
      </Form.Row>
    </div>
    <ProtectedContent
      authorize={SolicitudATPolicy.view}
    >
      <Form.Row className="mb-2">
        <Col>
          <SolicitudAtencionExternaFilterForm onFilter={(filter)=>{
            setFilter(filter)
          }} />
        </Col>
        <Col xs={"auto"}>
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
      <Table responsive>
        <thead>
          <tr>
            <th style={{width: 1}}>#</th>
            <th>Nº</th>
            <th>Fecha y hora</th>
            <th>Matrícula asegurado</th>
            <th>Doctor</th>
            <th>Proveedor</th>
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
    <Dm11Viewer />
  </div>
}