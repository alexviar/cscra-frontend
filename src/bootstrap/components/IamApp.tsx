import React from 'react'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'
import { FaTasks, FaUsers } from 'react-icons/fa'
import SidebarLayout from '../../commons/components/layouts/SidebarLayout'
import UsersIndex from '../../features/iam/components/UsersIndex'
import RolesIndex from '../../features/iam/components/RolesIndex'
import RoleForm from '../../features/iam/components/RoleForm'
import UserRegistrationForm from '../../features/iam/components/UserRegistrationForm'
import { UserView } from '../../features/iam/components/UserView'
import UserInfoForm from '../../features/iam/components/UserInfoForm'
import UserEditForm from '../../features/iam/components/UserEditForm'

export const IamApp = ()=>{
  const { path, url } = useRouteMatch()
  return <SidebarLayout sidebar={{
    items: [
      {
        id: "users",
        icon: <FaUsers />,
        path: `${url}/usuarios`,
        title: "Usuarios",
        // items: [
        //   {
        //     id: "register-user",
        //     icon: <FaUserPlus />,
        //     path: `${url}/empleados/registrar`,
        //     title: "Registrar"
        //   }
        // ]
      },
      {
        id: "roles",
        icon: <FaTasks />,
        path: `${url}/roles`,
        title: "Roles"
      }
    ]
  }}>
    <Switch>
      <Route exact path={`${url}`}>
        <Redirect to={`${url}/usuarios`} />
      </Route>
      <Route exact path={`${url}/usuarios`}>
        <UsersIndex />
      </Route>
      <Route exact path={`${url}/usuarios/registrar`}>
        <UserRegistrationForm />
      </Route>
      <Route exact path={`${url}/usuarios/:userId`}>
        <UserView />
      </Route>
      <Route exact path={`${url}/usuarios/:userId/editar`}>
        <UserEditForm />
      </Route>
      
      <Route exact path={`${url}/roles/:action(crear)`}>
        <RoleForm />
      </Route>
      <Route exact path={`${url}/roles/:id/:action(editar)`}>
        <RoleForm />
      </Route>
      <Route path={`${url}/roles`}>
        <RolesIndex />
      </Route>
    </Switch>
    
    {/* <Route exact path={`${url}/roles/:action(crear)`}>
      <RoleForm />
    </Route> */}
    {/* <Route exact path={`${url}/roles/:id/:action(editar)`}>
      <RoleForm />
    </Route> */}
  </SidebarLayout>
}

export default IamApp