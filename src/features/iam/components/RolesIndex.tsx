import React, { useEffect } from 'react'
import { Button, Spinner, Tab } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'
import { useQuery } from 'react-query'
import { useHistory, useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { Roles } from '../services'
import { RolesList } from './RolesList'
import { RoleView } from './RoleView'

export default ()=>{
  const history = useHistory()
  const { hash, pathname } = history.location//useLocation()
  const fetchRoles = useQuery("fetchRoles", ()=>{
    return Roles.fetchAll()
  }, {
    enabled: false,
    refetchOnWindowFocus: false
  })

  useEffect(()=>{
    fetchRoles.refetch()
  }, [])

  const roles = fetchRoles.data?.data || []

  return <>
  {/* <h1 className="mb-2" style={{fontSize: "2rem"}}>Roles</h1> */}
  <div className="mb-2 d-flex flex-nowrap" >
      <h2 className="d-inline-block" style={{fontSize: "2rem"}}>Roles</h2>
      <Button as={Link} to={{
          pathname:"/iam/roles/crear",
          state: {
            from: pathname
          }
        }}
        className="ml-auto my-auto" 
        variant="primary"
      >
        <FaPlus />
      </Button>
    </div>
  <Tab.Container defaultActiveKey={hash} transition={false} >
    <div className="list-details position-relative d-flex flex-grow-1">
      <div className="list border">
        {fetchRoles.isFetching ? 
          <Spinner animation="border" variant="primary" className="m-auto"/> : 
          <RolesList roles={roles} />}
      </div>
      <Tab.Content className="p-3 border flex-grow-1 overflow-auto"  style={{marginLeft: "11rem"}}>
        {
          roles.map(role=>{
            return <Tab.Pane key={role.id} eventKey={`#${role.id}`}>
              <RoleView roleId={role.id} />
            </Tab.Pane>
          })
        }
      </Tab.Content>
    </div>
  </Tab.Container>
  </>
} 