import { AxiosError } from "axios"
import {useState, useMemo, useRef} from "react"
import { Button, Breadcrumb, Collapse, Form, Table, Spinner, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useQuery } from "react-query"
import { FaSync, FaFilter, FaUserPlus } from "react-icons/fa"
import { Page } from "../../../../commons/services"
import { Pagination } from "../../../../commons/components"
import { ProtectedContent } from "../../../../commons/auth/components"
import { useUser } from "../../../../commons/auth/hooks"
import { UserService, UserFilter } from "../services"
import { usuarioPolicy } from "../policies"
import { UserFilterForm } from "./UserFilterForm"
import { RowOptions } from "./RowOptions"
import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
import { IndexTemplate } from "../../../../commons/components/IndexTemplate"
import { superUserPolicyEnhancer } from "../../../../commons/auth/utils"


export const UserIndex = ()=>{

  const user = useUser()

  const [page, setPage] = useState<Page>({
    current: 1,
    size: 10
  })

  const [filter, setFilter] = useState<UserFilter>(() => {
    const defaultFilter: UserFilter = {}
    if(usuarioPolicy.viewByRegionalOnly(user)){
      defaultFilter.regionalId = user!.regionalId;
    }
    return defaultFilter
  })

  const queryKey = ["usuarios", "buscar", filter, page]
  const buscar = useQuery(queryKey, ()=>{
    return UserService.buscar(filter, page)
  }, {
    enabled: !!superUserPolicyEnhancer(usuarioPolicy.view)(user),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const totalRef = useRef(-1)

  if(buscar.data) {
    totalRef.current = buscar.data.data.meta.total
  }

  const updateFilter = (filter: UserFilter)=>{
    buscar.remove()
    setFilter(oldFilter => ({...oldFilter, ...filter}));
    setPage(page => ({...page, current: 1}))
  }

  const loader = useMemo(()=>{
    const rows = []
    for(let index = 0; index < page.size; index++){
      rows.push(<tr key={index}>
        <th scope="row">
          {(page.current - 1)*page.size  + index + 1}
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
      <Breadcrumb.Item active>Usuarios</Breadcrumb.Item>
    </Breadcrumb>
    <IndexTemplate
      policy={usuarioPolicy}
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
      renderData={(usuario, index) => {
        return <tr key={usuario.id}>
          <th scope="row">
            {(page.current - 1)*page.size  + index + 1}
          </th>
          <td>
            {usuario.ci.texto}
          </td>
          <td>
            {usuario.nombreCompleto}
          </td>
          <td style={{textTransform: "none"}}>
            {usuario.username}
          </td>
          <td>
            {usuario.regional!.nombre}
          </td>
          <td>
            {usuario.estado == 1 ? "Habilitado" : usuario.estado == 2 ? "Bloqueado" : ""}
          </td>
          <td style={{textTransform: "none"}}>
            <RowOptions queryKey={queryKey} user={usuario} />
          </td>
        </tr>
      }}
      renderDataHeaders={()=>{
        return <tr>
          <th style={{ width: 1 }}>#</th>
          <th>Carnet de identidad</th>
          <th style={{ minWidth: 250}}>Nombre</th>
          <th>Login</th>
          <th>Regional</th>
          <th>Estado</th>
          <th style={{ width: 1 }}></th>
        </tr>
      }}
      renderLoader={()=>{
        return <>{loader}</>
      }}
      renderFilterForm={()=>{
        return <UserFilterForm onFilter={updateFilter} />
      }}
      renderCreateButton={()=>{
        return <Button
          as={Link}
          to={`/iam/usuarios/registrar`}
          className="d-flex align-items-center">
            <FaUserPlus className="mr-2" />Nuevo
        </Button>
      }}
    />
  </div>
}