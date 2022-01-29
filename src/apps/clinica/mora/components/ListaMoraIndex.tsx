import { useMemo, useRef, useState } from "react"
import { Breadcrumb, Button } from "react-bootstrap"
import { FaPlus } from "react-icons/fa"
import { useQuery } from "react-query"
import { Link } from "react-router-dom"
import { useUser } from "../../../../commons/auth"
import { ListaMoraService, ListaMoraFilter as Filter } from "../services"
import { ListaMoraFilterForm } from "./ListaMoraFilterForm"
import { RowOptions } from "./RowOptions"
import { listaMoraPolicy } from "../policies"
import { superUserPolicyEnhancer } from "../../../../commons/auth/utils"
import { IndexTemplate } from "../../../../commons/components/IndexTemplate"
import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'

export default () => {
  const [page, setPage] = useState({
    current: 1,
    size: 10
  })

  const user = useUser();

  const [filter, setFilter] = useState<Filter>(()=>{
    const defaultFilter: Filter = {}
    if(listaMoraPolicy.viewByRegionalOnly(user)){
      defaultFilter.regionalId = user?.regionalId;
    }
    return defaultFilter
  })

  const canView = !!superUserPolicyEnhancer(listaMoraPolicy.view)(user)
  const queryKey = ["listaMora.buscar", filter, page]
  const buscar = useQuery(queryKey, () => {
    return ListaMoraService.buscar(filter, page)
  }, {
    enabled: canView,
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
        </td>
      </tr>)
    }
    return rows
  }, [page.size])

  return <div className="px-1">
    <Breadcrumb>
      <Breadcrumb.Item active>Lista de mora</Breadcrumb.Item>
    </Breadcrumb>
    <IndexTemplate
      policy={listaMoraPolicy}
      isLoading={buscar.isFetching}
      hasError={buscar.isError}
      total={totalRef.current}
      page={page}
      data={buscar.data?.data.records}
      onSearch={(search)=>updateFilter({_busqueda: search})}
      renderLoader={()=>{
        return <>{loader}</>
      }}
      renderData={(item, index)=>{
        return <tr key={item.id}>
          <td>
            {(page.current - 1)*page.size + index + 1}
          </td>
          <td>
            {item.empleadorId}
          </td>
          <td>
            {item.numeroPatronal}
          </td>
          <td>
            {item.nombre}
          </td>
          <td>
            {item.regional!.nombre}
          </td>
          <td style={{textTransform: "none"}}>
            <RowOptions item={item} queryKey={queryKey} />
          </td>
        </tr>
      }}
      renderDataHeaders={()=>{
        return <tr>
          <th style={{width: 1}}>#</th>
          <th>ID Empleador</th>
          <th>N.º Patronal</th>
          <th style={{minWidth: 250}}>Razón social</th>
          <th>Regional</th>
          <th style={{width: 1}}></th>
        </tr>
      }}
      renderFilterForm={()=>{
        return <ListaMoraFilterForm onApply={updateFilter} />
      }}
      renderCreateButton={()=>{
        return <Button as={Link}
          to="/clinica/lista-mora/agregar"
        >
          <FaPlus className="mr-1" />
          Agregar
        </Button>
      }}
      onPageChange={(page)=>setPage(page)}
      onRefetch={()=>{
        buscar.remove()
        buscar.refetch({throwOnError: true})
      }}
    />
  </div>
}