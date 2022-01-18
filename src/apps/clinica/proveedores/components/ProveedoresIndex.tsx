import { AxiosError } from "axios"
import { useMemo, useRef, useState } from "react"
import { Button, Col, Collapse, Form, Spinner, Table } from "react-bootstrap"
import Skeleton from "react-loading-skeleton"
import { FaFilter, FaSync, FaPlus } from "react-icons/fa"
import { useQuery } from "react-query"
import { Link, useLocation } from "react-router-dom"
import { Pagination } from "../../../../commons/components"
import { ProtectedContent, useUser } from "../../../../commons/auth"
import { proveedorPolicy } from "../policies"
import { ProveedoresService, Filter } from "../services"
import { ProveedoresFilterForm } from "./ProveedoresFilterForm"
import { RowOptions } from "./RowOptions"
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

  const [filter, setFilter] = useState<Filter>({})

  if(proveedorPolicy.viewByRegionalOnly(user)) {
    filter.regionalId = user?.regionalId;
  }

  const totalRef = useRef(0)

  const queryKey = ["proveedores", "buscar", filter, page]
  const buscar = useQuery(queryKey, () => {
    return ProveedoresService.buscar(page, filter)
  }, {
    enabled: !!superUserPolicyEnhancer(proveedorPolicy.view)(user),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: ({data}) =>{
      totalRef.current = data.meta.total
    }
  })

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
        <td style={{minWidth: 100}}>
          <Skeleton />
        </td>
        <td>
        </td>
      </tr>)
    }
    return rows
  }, [page.size])

  return <IndexTemplate
    policy={proveedorPolicy}
    page={page}
    onPageChange={setPage}
    total={totalRef.current}
    onRefetch={buscar.refetch}
    isLoading={buscar.isFetching}
    hasError={buscar.isError}
    data={buscar.data?.data.records}
    renderData={(item, index) => {
      return <tr key={item.id}>
        <th scope="row" style={{ width: 1 }}>
          {index + 1}
        </th>
        <td>
          {item.tipo == 1 ? item.nombreCompleto : item.nombre}
        </td>
        <td style={{minWidth: 100}}>
          {item.tipo == 1 ? "Medico" : "Empresa"}
        </td>
        <td>
          <RowOptions proveedor={item} queryKey={queryKey} />
        </td>
      </tr>
    }}
    renderDataHeaders={()=>{
      return <tr>
        <th style={{ width: 1 }}>#</th>
        <th>Nombre</th>
        <th style={{ width: 1 }}>Tipo</th>
        <th style={{ width: 1 }}></th>
      </tr>
    }}
    renderLoader={()=>{
      return <>{loader}</>
    }}
    renderFilterForm={()=>{
      return <ProveedoresFilterForm onFilter={(filter) => {
        setFilter(filter)
        setPage(page => ({ ...page, current: 1 }))
      }} />
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
}