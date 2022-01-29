import { useMemo, useRef, useState } from "react"
import { Button, Breadcrumb } from "react-bootstrap"
import Skeleton from "react-loading-skeleton"
import { FaPlus } from "react-icons/fa"
import { Link, useLocation } from "react-router-dom"
import { useQuery } from "react-query"
import { Page } from "../../../../commons/services/Page"
import { SolicitudesAtencionExternaFilter as Filter, SolicitudesAtencionExternaService } from "../services/SolicitudesAtencionExternaService"
import { SolicitudAtencionExternaFilterForm } from "./SolicitudAtencionExternaFilterForm"
import { useUser } from "../../../../commons/auth/hooks"
import { RowOptions } from "./RowOptions"
import { solicitudAtencionExternaPolicy } from "../policies"
import { IndexTemplate } from "../../../../commons/components/IndexTemplate"
import { superUserPolicyEnhancer } from "../../../../commons/auth/utils"

export const SolicitudAtencionExternaIndex = ()=>{
  const {pathname: path} = useLocation()
  const [page, setPage] = useState<Page>({
    current: 1,
    size: 10
  })

  const user = useUser();

  const [filter, setFilter] = useState<Filter>(()=>{
    const defaultFilter: Filter = {}
    if(solicitudAtencionExternaPolicy.viewByRegionalOnly(user)){
      defaultFilter.regionalId = user!.regionalId;
    }
    return defaultFilter
  })

  const canView = !!superUserPolicyEnhancer(solicitudAtencionExternaPolicy.view)(user)
  const buscar = useQuery(["solicitudesAtencionExterna.buscar", page, filter], ()=>{
    return SolicitudesAtencionExternaService.buscar(filter, page)
  }, {
    enabled: !!canView,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })

  const totalRef = useRef(-1)

  if(buscar.data) {
    totalRef.current = buscar.data.data.meta.total
  }
  
  const updateFilter = (filter: Filter)=>{
    buscar.remove()
    setFilter(oldFilter => ({...oldFilter, ...filter}));
    setPage(page => ({...page, current: 1}))
  }

  const loader = useMemo(()=>{
    const rows = []
    for(let i = 0; i < page.size; i++){
      rows.push(<tr key={i}>
        <th scope="row">
          {i + 1}
        </th>
        <td>
          <Skeleton />
        </td>
        <td>
          <Skeleton />
        </td>
        <td>
          <Skeleton />
        </td>
        <td>
          <Skeleton />
        </td>
        <td>
          <Skeleton />
        </td>
        <td>
          <Skeleton />
        </td>
        <td>
          <Skeleton />
        </td>
        <td>
          <Skeleton />
        </td>
        <td>
          <Skeleton />
        </td>
        <td>
        </td>
      </tr>)
    }
    return rows
  }, [page.size])

  return <div className="px-1">
    <Breadcrumb>
      <Breadcrumb.Item active>Solicitudes de atencion externa</Breadcrumb.Item>
    </Breadcrumb>
    <IndexTemplate
      policy={solicitudAtencionExternaPolicy}
      isLoading={buscar.isFetching}
      hasError={buscar.isError}
      total={totalRef.current}
      page={page}
      data={buscar.data?.data.records}
      renderLoader={()=>{
        return <>{loader}</>
      }}
      renderData={(solicitud, index)=>{
        return <tr key={solicitud.id}>
          <th scope="row">
              {(page.current - 1)*page.size + index + 1}
          </th>
          <td>{solicitud.id}</td>
          <td>{solicitud.fecha}</td>
          <td>
            <div style={{width: "max-content", maxWidth: 300}}>{solicitud.regional.nombre}</div>
          </td>
          <td>
            <div style={{width: "max-content", maxWidth: 300}}>{solicitud.paciente.nombreCompleto}</div>
            <div className="text-small text-muted">{solicitud.paciente.matricula}</div>
          </td>
          <td>
            <div style={{width: "max-content", maxWidth: 300}}>{solicitud.prestacion}</div>
          </td>
          <td>
            <div style={{width: "max-content", maxWidth: 300}}>{solicitud.medico.nombreCompleto}</div>
            <div className="text-small text-muted">{solicitud.medico.especialidad}</div>
          </td>
          <td>
            <div style={{width: "max-content", maxWidth: 300}}>{solicitud.proveedor.razonSocial}</div>
            <div className="text-small text-muted">{(solicitud.proveedor as any).especialidad}</div>
          </td>
          <td>
            <div style={{width: "max-content", maxWidth: 300}}>{solicitud.empleador.nombre}</div>
            <div className="text-small text-muted">{solicitud.empleador?.numeroPatronal}</div>
          </td>
          <td>
            <div style={{width: "max-content", maxWidth: 300}}>{solicitud.titular?.nombreCompleto}</div>
            <div className="text-small text-muted">{solicitud.titular?.matricula}</div>
          </td>
          <td style={{textTransform: "none"}}>
            <RowOptions solicitud={solicitud} />
          </td>
        </tr>
      }}
      renderDataHeaders={()=>{
        return <tr>
          <th style={{width: 1}}>#</th>
          <th>Nº</th>
          <th style={{minWidth: 155}}>Fecha</th>
          <th>Regional</th>
          <th>Paciente</th>
          <th>Prestación</th>
          <th>Proveedor</th>
          <th>Medico</th>
          <th>Empleador</th>
          <th>Titular</th>
          <th style={{width: 1}}></th>
        </tr>
      }}
      renderFilterForm={()=>{
        return <SolicitudAtencionExternaFilterForm onFilter={updateFilter} />
      }}
      renderCreateButton={()=>{
        return <Button
          as={Link}
          to={`${path}/registrar`}
          className="d-flex align-items-center">
            <FaPlus className="mr-1" /><span>Nuevo</span>
        </Button>
      }}
      onPageChange={(page)=>setPage(page)}
      onRefetch={()=>{
        buscar.remove()
        buscar.refetch({throwOnError: true})
      }}
      onSearch={(search)=>{
        updateFilter({_busqueda: search})
      }}
    />
    {/* <div className="d-flex my-2">
      <Form.Row className="ml-auto flex-nowrap" >
        <ProtectedContent
          authorize={solicitudAtencionExternaPolicy.view}
        >
          <Col xs="auto" >
            <Button onClick={()=>{
              buscar.refetch()
            }}><FaSync /></Button>
          </Col>
          <Col xs="auto" >
            <Button onClick={()=>{
              setShowFilterForm(visible=>!visible)
            }}><FaFilter /></Button>
          </Col>
        </ProtectedContent>
        <ProtectedContent
          authorize={solicitudAtencionExternaPolicy.register}
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
      authorize={solicitudAtencionExternaPolicy.view}
    >
      <Form.Row className="mb-2">
        <Col xs={12}>
          <Collapse in={showFilterForm}>
            <div>
              <SolicitudAtencionExternaFilterForm onFilter={(filter)=>{
                setFilter(filter)
                setPage(page=>({ ...page, current: 1 }))
              }} />
            </div>
          </Collapse>
        </Col>
        <Col className="ml-auto" xs={"auto"}>
          <div className="d-flex flex-row flex-nowrap align-items-center">
            <span>Mostrar</span>
            <Form.Label htmlFor="pageSizeSelector" srOnly>Tamaño de pagina</Form.Label>
            <Form.Control id="pageSizeSelector" className="mx-2" as="select" value={page.size} onChange={(e) => {
              const value = e.target.value
              setPage({
                current: 1,
                size: parseInt(value)
              })
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
    </ProtectedContent> */}
  </div>
}