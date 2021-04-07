import React from 'react'
import { Container } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'
import { Sidebar, SidebarProps } from '../Sidebar'
import "./simple-sidebar.css"

type Props = {
  sidebar: SidebarProps
  children: React.ReactNode
}
export const SidebarLayout = ({sidebar, children}: Props)=>{
  const showSidebar = useSelector((state:any)=>state.main.showSidebar)
  const { path, url } = useRouteMatch()
  
  return <div className={"position-relative d-flex flex-grow-1 bg-light" + (showSidebar ? "" : " toggled")}  id="wrapper">
    <Sidebar className="bg-white shadow-sm" {...sidebar}/>
    <Container className="d-flex flex-column flex-grow-1" style={{overflow: "auto"}}>
      {/* <Switch>
        <Route exact path={path}>
            <Redirect to={`${path}/organizacion`} />
        </Route>
        <Route  path={`${path}/organizacion`}><Organization /></Route>
        <Route  path={`${path}/empleados/registrar`}><EmployeeForm /></Route>
        <Route  exact path={`${path}/empleados`}><EmployeesList /></Route>
      </Switch> */}
      <div className="d-flex flex-column bg-white rounded-lg shadow-sm m-2 p-3 flex-grow-1">
        {children}
      </div>
    </Container>
  </div>
}

export default SidebarLayout