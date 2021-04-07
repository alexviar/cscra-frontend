import React from 'react'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'
import UsersIndex from './UsersIndex'
import RolesIndex from './RolesIndex'
import RoleForm from './RoleForm'

export default ()=>{  
  const { path, url } = useRouteMatch()
  return <>
    <Switch>
      <Route exact path={`${url}`}>
        <Redirect to="/usuarios" />
      </Route>
      <Route path={`${url}/usuarios`}>
        <UsersIndex />
      </Route>
      <Route path={`${url}/roles`}>
        <RolesIndex />
      </Route>
    </Switch>
    
    <Route exact path={`${url}/roles/:action(crear)`}>
      <RoleForm />
    </Route>
    <Route exact path={`${url}/roles/:action(editar)/:id`}>
      <RoleForm />
    </Route>
  </>
}