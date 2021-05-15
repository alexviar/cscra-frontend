import { useMemo } from 'react'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'
import { FaTasks, FaUsers } from 'react-icons/fa'
import SidebarLayout from '../../commons/components/layouts/SidebarLayout'
import { ProtectedRoute } from '../../commons/auth/components'
import { useLoggedUser } from '../../commons/auth/hooks'
import {UserIndex, UserView, UserForm, CambiarContrasenaForm } from './usuarios/components'
import {RolIndex, RolView, RolForm} from './roles/components'
import { UsuarioPolicy } from './usuarios/policies'
import { RolPolicy } from './roles/policies'

export const IamApp = ()=>{
  const { url } = useRouteMatch()
  const loggedUser = useLoggedUser()

  const sidebarItems = useMemo(()=>{
    const items = [] as any[]
    if(UsuarioPolicy.index(loggedUser)) {
      items.push({
        id: "users",
        icon: <FaUsers />,
        path: `${url}/usuarios`,
        title: "Usuarios",
      })
    }
    if(RolPolicy.index(loggedUser)){
      items.push(
        {
          id: "roles",
          icon: <FaTasks />,
          path: `${url}/roles`,
          title: "Roles"
        }
      )
    }
    return items
  }, [loggedUser])

  return <SidebarLayout sidebar={{
    items: sidebarItems
  }}>
    <Switch>
      {/* <Route exact path={`${url}`}>
        <Redirect to={`${url}/usuarios`} />
      </Route> */}
      <ProtectedRoute exact path={`${url}/usuarios`}
        authorize={UsuarioPolicy.index}
      >
        <UserIndex />
      </ProtectedRoute>
      <ProtectedRoute exact path={[`${url}/usuarios/registrar`, `${url}/usuarios/:id/editar`]}
        authorize={(user, currentUrl) => currentUrl == `${url}/usuarios/registrar` ? UsuarioPolicy.register(user) : UsuarioPolicy.edit(user)}
      >
        <UserForm />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/usuarios/:id/cambiar-contrasena`}
        authorize={UsuarioPolicy.changePassword}
      >
        <CambiarContrasenaForm />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/usuarios/:id`}
        authorize={UsuarioPolicy.view}
      >
        <UserView />
      </ProtectedRoute>
      
      <ProtectedRoute exact path={`${url}/roles`}
        authorize={RolPolicy.index}
      >
        <RolIndex />
      </ProtectedRoute>
      <ProtectedRoute exact path={[`${url}/roles/registrar`, `${url}/roles/:id/editar`]}
        authorize={(user, currentUrl) => currentUrl == `${url}/roles/registrar` ? RolPolicy.register(user) : RolPolicy.edit(user)}
      >
        <RolForm />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/roles/:id`}
        authorize={RolPolicy.view}
      >
        <RolView />
      </ProtectedRoute>
    </Switch>
  
  </SidebarLayout>
}

export default IamApp