import React, {useEffect, useState, useMemo, useRef} from "react"
import { Table, Button, Pagination, Form, Row, Col, Spinner } from 'react-bootstrap'
import { BsEyeFill, BsTrashFill } from "react-icons/bs"
import { useDispatch, useSelector } from "react-redux"
import Qs from "qs"
import { Link, useLocation, useRouteMatch } from "react-router-dom"
import { Users } from "../services"
import UsersPagination from "./UsersPagination"
import { FaFilter, FaSync, FaUserPlus } from "react-icons/fa"
import UsersFilter from "./UsersFilter"
import { useQuery } from "react-query"
import { AxiosError } from "axios"
// import FilterUsersForm from "./FilterUsersForm"

export default ()=>{  
  const dispatch = useDispatch()
  const [{current, size}, setPage] = useState({
    // total: 0,
    current: 1,
    size: 10
  })
  const [ filter, setFilter ] = useState({
    username: undefined,
    active: undefined
  })
  const [usersFilterVisible, showUsersFilter] = useState(false)
  const { search, state: locationState } = useLocation<{page: any, filter: any}>()
  const { url, path } = useRouteMatch()
  // const users = useSelector(getUsers)
  // const {current, size} = useSelector(getUsersPagination)

  const {
    isFetching,
    isError,
    data: fetchUsersResponse,
    error: fetchUsersError,
    refetch
  } = useQuery(["fetchUsers", current, size, filter], async ()=>{
    const response = await Users.loadAll({
      current: current,
      size: size
    }, filter)
    return response
  }, {
    keepPreviousData: true,
    refetchOnWindowFocus: false
  })
  const users = fetchUsersResponse?.data.records
  const total = fetchUsersResponse?.data.meta.total || 0
  // const parsedSearch = useMemo(()=>Qs.parse(search.substr(1)), [search])
  // const mergedSearch = useRef<any>()
  // const lastParsedSearch = useRef<any>()
  // useEffect(()=>{
  //   if(lastParsedSearch.current != parsedSearch){
  //     lastParsedSearch.current = parsedSearch
  //     mergedSearch.current = {
  //       page: {
  //         ...page,
  //         ...(parsedSearch.page as Qs.ParsedQs || {})
  //       },
  //       filter: {
  //         ...filter,
  //         ...(parsedSearch.fiter as Qs.ParsedQs || {})
  //       }
  //     }
  //     dispatch({
  //       type: "UPDATE_USERS_PAGINATION",
  //       payload: mergedSearch.current.page
  //     })
  //   }
  // }, [page, filter, parsedSearch])

  // useEffect(()=>{
  //   if(mergedSearch.current){
  //     Users.loadAll(mergedSearch.current.page as any, mergedSearch.current.filter as any)
  //     .then(({data})=>{
  //       dispatch({
  //         type: "LOAD_USERS_COMPLETED",
  //         payload: data
  //       })
  //       console.log(data)
  //     })
  //   }
  // }, [mergedSearch.current])

  useEffect(()=>{
    document.title = "Usuarios"
  }, [])

  function renderRows(){
    return isFetching ? (
      <tr>
        <td className="bg-light text-center" colSpan={100}>
          <Spinner className="mr-2" variant="primary" animation="border" size="sm" />
          Cargando
        </td>
      </tr>
    ) : (isError ? (
      <tr>
        <td className="bg-light text-center" colSpan={100}>
          {(fetchUsersError as AxiosError).response?.data?.message || (fetchUsersError as AxiosError).message}
        </td>
      </tr>
    ) : (
      users?.map((u, i)=>{
        return <tr key={u.id}>
          <th scope="row">
            {i+1}
          </th>
          <td>{u.username}</td>
          <td className={u.active ? "bg-success" : "bg-danger"}><span className="text-light">{u.active ? "Activo" : "Inactivo"}</span></td>
          <td>
            <div className="d-flex">
              <Button className="btn-icon" variant="link" ><BsEyeFill /></Button>
              {/* <Button className="btn-icon d-inline" variant="link" ><BsTrashFill /></Button> */}
            </div>
          </td>
        </tr>
      })
    ))
  }

  return <div className="d-flex flex-column bg-white rounded-lg shadow-sm m-2 p-3 flex-grow-1">
    <h1 style={{fontSize: "2rem"}}>Usuarios</h1>
    <div className="d-flex flex-nowrap">
      <Row className="mr-auto flex-nowrap">
        <Col className="d-flex flex-nowrap align-items-center">
          <span>Mostrar</span>
          <Form.Control className="mx-2" as="select" value={size} onChange={(e)=>{
            const value = e.target.value
            setPage((page)=>({
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
        </Col>
      </Row>
      <Row className="ml-auto flex-nowrap" >
        <Col className={"pr-0"} xs="auto" >
          <Button className="my-2" onClick={()=>{
            refetch()
          }}><FaSync /></Button>
        </Col>
        <Col className={"pr-0"} xs="auto" >
          <Button className="my-2" onClick={()=>{
            showUsersFilter(visible=>!visible)
          }}><FaFilter /></Button>
        </Col>
        <Col xs="auto">
          <Button as={Link}
            to={`${path}/registrar`}
            className="my-2" onClick={()=>{
            // showUserRegistrationModal()
          }}><FaUserPlus /></Button>
        </Col>
      </Row>
    </div>
    <UsersFilter
      className={"mt-2" + (usersFilterVisible ? "" : " d-none")}
      onApply={(filter: any)=>{
        showUsersFilter(false)
        setFilter(filter)
      }} />
    <Table responsive className="small text-nowrap">
      <thead>
        <tr>
          <th style={{width: 1}}>#</th>
          <th >Nombre de usuario</th>
          <th style={{width: "6rem"}}>Estado</th>
          <th style={{width: 1}}></th>
        </tr>
      </thead>
      <tbody>
        {renderRows()}
      </tbody>
    </Table>
    <div className="mt-auto align-self-center">
      <UsersPagination
        current={current}
        minimum={Math.max(1, current - 4)}
        maximum={Math.min(Math.trunc((total-size)/size)+1, current + 4)}
        total={((total-size)/size)+1}
        onClickFirst={()=>setPage((page)=>({...page, current: 1}))}
        onClickPrev={()=> {
            console.log("Previous");
            setPage((page)=>({...page, current: page.current - 1}))
          }}
        onClickItem={(current)=>setPage((page)=>({...page, current}))}
        onClickNext={()=>setPage(page=>({...page, current: page.current + 1}))}
        onClickLast={()=>setPage(page=>({...page, current: ((total-size)/size)+1}))}
      />
    </div>
  </div>
}