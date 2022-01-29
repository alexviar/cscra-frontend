import { useMemo, useRef, useState } from "react"
import { Button, Breadcrumb } from "react-bootstrap"
import Skeleton from "react-loading-skeleton"
import { FaPlus } from "react-icons/fa"
import { useQuery } from "react-query"
import { Link, useLocation } from "react-router-dom"
import { proveedorPolicy } from "../policies"
import { ProveedoresService, Filter } from "../services"
import { ProveedoresFilterForm } from "./ProveedoresFilterForm"
import { RowOptions } from "./RowOptions"
import { useUser } from "../../../../commons/auth"
import { superUserPolicyEnhancer } from "../../../../commons/auth/utils"
import { IndexTemplate } from "../../../../commons/components/IndexTemplate"
import 'react-loading-skeleton/dist/skeleton.css'

export const ProveedoresIndex = () => {
  const { pathname: path } = useLocation()
  const [page, setPage] = useState({
    current: 1,
    size: 10
  })

  const user = useUser()

  const [filter, setFilter] = useState<Filter>(() => {
    const defaultFilter: Filter = {}
    if(proveedorPolicy.viewByRegionalOnly(user)) {
      defaultFilter.regionalId = user?.regionalId;
    }
    return defaultFilter
  })

  const queryKey = ["proveedores", "buscar", filter, page]

  const buscar = useQuery(queryKey, () => {
    return ProveedoresService.buscar(page, filter)
  }, {
    enabled: !!superUserPolicyEnhancer(proveedorPolicy.view)(user),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
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
        </td>
      </tr>)
    }
    return rows
  }, [page.size])

  return <div className="px-1">
    <Breadcrumb>
      <Breadcrumb.Item active>Proveedores</Breadcrumb.Item>
    </Breadcrumb>
    <IndexTemplate
      policy={proveedorPolicy}
      page={page}
      onSearch={(search)=>{
        updateFilter({_busqueda: search})
      }}
      onPageChange={setPage}
      total={totalRef.current}
      onRefetch={()=>{
        buscar.remove()
        buscar.refetch({throwOnError: true})
      }}
      isLoading={buscar.isFetching}
      hasError={buscar.isError}
      data={buscar.data?.data.records}
      renderData={(item, index) => {
        return <tr key={item.id}>
          <th scope="row">
            {(page.current - 1)*page.size  + index + 1}
          </th>
          <td>
            {item.tipo == 1 ? "Medico" : "Empresa"}
          </td>
          <td>
            {item.razonSocial}
          </td>
          <td>
            {item.regional!.nombre}
          </td>
          <td>
            {item.estado == 1 ? "Activo" : item.estado == 2 ? "De baja" : ""}
          </td>
          <td style={{textTransform: "none"}}>
            <RowOptions proveedor={item} queryKey={queryKey} />
          </td>
        </tr>
      }}
      renderDataHeaders={()=>{
        return <tr>
          <th style={{ width: 1 }}>#</th>
          <th>Tipo</th>
          <th style={{ minWidth: 250}}>Nombre</th>
          <th>Regional</th>
          <th>Estado</th>
          <th style={{ width: 1 }}></th>
        </tr>
      }}
      renderLoader={()=>{
        return <>{loader}</>
      }}
      renderFilterForm={()=>{
        return <ProveedoresFilterForm onFilter={updateFilter} />
      }}
      renderCreateButton={()=>{
        return <Button
          as={Link}
          to={`${path}/registrar`}
          className="d-flex align-items-center">
          <FaPlus className="mr-1" /><span>Nuevo</span>
        </Button>
      }}
    />
  </div>
}