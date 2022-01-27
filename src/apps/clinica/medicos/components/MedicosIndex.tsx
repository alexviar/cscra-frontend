import { AxiosPromise } from "axios"
import { useMemo, useRef, useState } from "react"
import { Breadcrumb, Button } from "react-bootstrap"
import { FaPlus } from "react-icons/fa"
import { useQuery } from "react-query"
import { Link, useLocation } from "react-router-dom"
import { useUser } from "../../../../commons/auth"
import { PaginatedResponse } from "../../../../commons/services"
import { superUserPolicyEnhancer } from "../../../../commons/auth/utils"
import { Medico, MedicosService, MedicoFilter as Filter } from "../services"
import { medicoPolicy } from "../policies"
import { MedicosFilterForm } from "./MedicosFilterForm"
import { RowOptions } from "./RowOptions"
import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
import { IndexTemplate } from "../../../../commons/components/IndexTemplate"

export const MedicosIndex = () => {
  const {pathname: path} = useLocation()
  const [page, setPage] = useState({
    current: 1,
    size: 10
  })

  const user = useUser();
  
  const [filter, setFilter] = useState<Filter>(() => {
    const defaultFilter: Filter = {}
    if(medicoPolicy.viewByRegionalOnly(user)){
      defaultFilter.regionalId = user!.regionalId;
    }
    return defaultFilter
  })

  const queryKey = ["medicos", "buscar", filter, page];

  const buscar = useQuery(queryKey, () => {
    return MedicosService.buscar(page, filter) as AxiosPromise<PaginatedResponse<Medico>>
  }, {
    enabled: !!superUserPolicyEnhancer(medicoPolicy.view)(user),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const totalRef = useRef(-1)

  if(buscar.data) {
    totalRef.current = buscar.data.data.meta.total
  }

  const loader = useMemo(()=>{
    const rows = []
    for(let i = 0; i < page.size; i++){
      rows.push(<tr key={i}>
        <th scope="row" style={{ width: 1 }}>
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
        </td>
      </tr>)
    }
    return rows
  }, [page.size])

  return <div className="px-1">
    <Breadcrumb>
      <Breadcrumb.Item active>Médicos</Breadcrumb.Item>
    </Breadcrumb>
    <IndexTemplate
      policy={medicoPolicy}
      page={page}
      onPageChange={setPage}
      total={totalRef.current}
      onRefetch={()=>{
        buscar.remove()
        buscar.refetch({throwOnError: true})
      }}
      isLoading={buscar.isFetching}
      hasError={buscar.isError}
      data={buscar.data?.data.records}
      renderData={(medico, index) => {
        return <tr key={medico.id}>
          <th scope="row">
            {(page.current - 1)*page.size  + index + 1}
          </th>
          <td>
            {medico.ci.texto}
          </td>
          <td>
            {medico.nombreCompleto}
          </td>
          <td>
            {medico.especialidad}
          </td>
          <td>
            {medico.regional!.nombre}
          </td>
          <td>
            {medico.estado == 1 ? "Activo" : medico.estado == 2 ? "De baja" : ""}
          </td>
          <td style={{textTransform: "none"}}>
            <RowOptions queryKey={queryKey} medico={medico} />
          </td>
        </tr>
      }}
      renderDataHeaders={()=>{
        return <tr>
          <th style={{ width: 1 }}>#</th>
          <th>Carnet de identidad</th>
          <th style={{ minWidth: 250}}>Nombre</th>
          <th>Especialidad</th>
          <th>Regional</th>
          <th>Estado</th>
          <th style={{ width: 1 }}></th>
        </tr>
      }}
      renderLoader={()=>{
        return <>{loader}</>
      }}
      renderFilterForm={()=>{
        return <MedicosFilterForm onFilter={(filter) => {
          buscar.remove()
          setFilter(filter)
          setPage(page => ({ ...page, current: 1 }))
        }} />
      }}
      renderCreateButton={()=>{
        return  <Button
          as={Link}
          to={`${path}/registrar`}
          className="d-flex align-items-center">
            <FaPlus className="mr-1" /><span>Nuevo</span>
        </Button>
      }}
    />
  </div>
}