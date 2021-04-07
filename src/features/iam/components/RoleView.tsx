import React, {useEffect, useMemo} from 'react'
import { Alert, Button, ListGroup, Spinner, Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Role } from '../state'
import { Roles } from '../services'
import { useQuery } from 'react-query'
import { FaEdit } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
// import { makeGetWageById } from '../selectors/getSelectedWage'
// import { Wage } from '../state'


export const RoleView = ({roleId}: {roleId: number})=>{
  const { pathname } = useLocation()
  const fetchRole = useQuery(["fetchRole", roleId], ()=>{
    return Roles.fetch(roleId)
  }, {
    enabled: false,
    // refetchOnWindowFocus: false
  })

  useEffect(()=>{
    fetchRole.refetch()
  }, [])



  const role = fetchRole.data?.data
  
  if(fetchRole.isFetching){
    return <Spinner animation="border" variant="primary" className="d-block m-auto"></Spinner>
  }

  if(fetchRole.isError){
    return <Alert variant="danger">
      {fetchRole.error?.response?.message || fetchRole.error?.message}
    </Alert>
  }

  return <>
    {/* <h2 className="text-capitalize mb-2" style={{fontSize: "1.75rem"}}>{role?.name}</h2> */}
    <div className="mb-2 d-flex flex-nowrap" >
      <h2 className="text-capitalize d-inline-block" style={{fontSize: "1.75rem"}}>{role?.name}</h2>
      <Button as={Link} to={{
          pathname: `/iam/roles/${roleId}/editar`,
          state: {
            from: pathname
          }
        }}
        className="btn-icon mb-auto"
        variant="link"
      >
        <FaEdit />
      </Button>
    </div>
    
    <Table>
      <tbody>
        <tr>
          <th scope="row" style={{width: '1px'}}>Nombre</th>
          <td className="text-capitalize">{role?.name}</td>
        </tr>
        <tr>
          <th className="text-nowrap" scope="row">Descripción</th>
          <td className={role?.description ? "" : "bg-light"}>{role?.description || "Sin descripción"}</td>
        </tr>
        <tr>
          <th scope="row">Fecha de creación</th>
          <td>{role?.createdAt}</td>
        </tr>
        <tr>
          <th scope="row">Fecha de actualización</th>
          <td>{role?.updatedAt}</td>
        </tr>
        <tr>
          <th scope="row">Permisos</th>
            <td className={`d-flex ${role?.permissions.length ? "" : "bg-light"}`}>{
              role?.permissions.length ? 
              <ul className="d-inline-block">{role?.permissions.map((p, i)=><li key={i} className="text-capitalize">{p}</li>)}</ul> :
              "No se agregaron permisos"
            }
              {/* <Button className="btn-icon ml-auto mb-auto" style={{top: 0, right: 0}} variant="link" onClick={()=>{
                      //refetch()
              }}><FaEdit /></Button> */}
            </td>
        </tr>
      </tbody>
    </Table>
  </>
}