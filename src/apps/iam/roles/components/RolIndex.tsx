import { AxiosPromise, AxiosError } from "axios"
import React, {useMemo, useState, useRef} from "react"
import { Button, Breadcrumb, Form, Modal, Table, Spinner, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useQuery, useMutation } from "react-query"
import { FaSync, FaFilter, FaPlus } from "react-icons/fa"
import { Page, PaginatedResponse } from "../../../../commons/services"
import { RolFilterForm } from "./RolFilterForm"
import { useUser } from "../../../../commons/auth/hooks"
import { Rol, RolService, RolFilter } from "../services"
import { rolPolicy } from "../policies"
import { RowOptions } from "./RowOptions"
import { IndexTemplate } from "../../../../commons/components/IndexTemplate"
import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
import { superUserPolicyEnhancer } from "../../../../commons/auth/utils"

export const RolIndex = ()=>{

  const user = useUser()

  const [page, setPage] = useState<Page>({
    current: 1,
    size: 10
  })

  const [filter, setFilter] = useState<RolFilter>({})

  const queryKey = ["roles", "buscar", page, filter]
  const buscar = useQuery(queryKey, ()=>{
    return RolService.buscar(filter, page) as AxiosPromise<PaginatedResponse<Rol>>
  }, {
    enabled: !!superUserPolicyEnhancer(rolPolicy.view)(user),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })
  
  const totalRef = useRef(-1)

  if(buscar.data) {
    totalRef.current = buscar.data.data.meta.total
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
        </td>
      </tr>)
    }
    return rows
  }, [page.size])

  return <div className="px-1">
    <Breadcrumb>
      <Breadcrumb.Item active>Roles</Breadcrumb.Item>
    </Breadcrumb>
    <IndexTemplate
      policy={rolPolicy}
      page={page}
      onSearch={(search) => {
        setFilter(filter => ({...filter, _busqueda: search}))
        setPage(page => ({...page, current: 1}))
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
      renderData={(rol, index) => {
        return <tr key={rol.id}>
          <th scope="row">
            {(page.current - 1)*page.size  + index + 1}
          </th>
          <td>
            {rol.name}
          </td>
          <td>
            {rol.description}
          </td>
          <td style={{textTransform: "none"}}>
            <RowOptions queryKey={queryKey} rol={rol} />
          </td>
        </tr>
      }}
      renderDataHeaders={()=>{
        return <tr>
          <th style={{ width: 1 }}>#</th>
          <th>Nombre</th>
          <th style={{ minWidth: 250}}>Descripción</th>
          <th style={{ width: 1 }}></th>
        </tr>
      }}
      renderLoader={()=>{
        return <>{loader}</>
      }}
      // renderFilterForm={()=>{
      //   return <RolFilterForm onSearch={(filter) => {
      //     buscar.remove()
      //     setFilter({_busqueda: filter})
      //     setPage(page => ({ ...page, current: 1 }))
      //   }} />
      // }}
      renderCreateButton={()=>{
        return <Button
          as={Link}
          to={`/iam/roles/registrar`}
          className="d-flex align-items-center">
            <FaPlus className="mr-2" />Nuevo
        </Button>
      }}
    />
  </div>


}