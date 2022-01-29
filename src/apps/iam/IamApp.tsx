import { useMemo } from 'react'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'
import { FaTasks, FaUsers } from 'react-icons/fa'
import SidebarLayout from '../../commons/components/layouts/SidebarLayout'
import { ProtectedRoute } from '../../commons/auth/components'
import { useUser } from '../../commons/auth/hooks'
import {UserIndex, UserView, UserForm, CambiarContrasenaForm } from './usuarios/components'
import {RolIndex, RolView, RolForm} from './roles/components'
import { usuarioPolicy } from './usuarios/policies'
import { rolPolicy } from './roles/policies'
import { Image } from 'react-bootstrap'
import { superUserPolicyEnhancer } from '../../commons/auth/utils'

export const IamApp = ()=>{
  const { url } = useRouteMatch()
  const loggedUser = useUser()

  const sidebarItems = useMemo(()=>{
    const items = [] as any[]
    if(superUserPolicyEnhancer(usuarioPolicy.index)(loggedUser)) {
      items.push({
        id: "users",
        icon: <FaUsers />,
        path: `${url}/usuarios`,
        title: "Usuarios",
      })
    }
    if(superUserPolicyEnhancer(rolPolicy.index)(loggedUser)){
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

  return <SidebarLayout 
    sidebar={{
        header: <div className="d-flex justify-content-center"><Image src="/logo-lg.png" /></div>,
        items: sidebarItems
    }}
  >
    <Switch>
      {/* <Route exact path={`${url}`}>
        <Redirect to={`${url}/usuarios`} />
      </Route> */}
      <ProtectedRoute exact path={`${url}/usuarios`}
        authorize={usuarioPolicy.index}
      >
        <UserIndex />
      </ProtectedRoute>
      <ProtectedRoute exact path={[`${url}/usuarios/registrar`, `${url}/usuarios/:id/editar`]}
        authorize={(user, currentUrl) => currentUrl == `${url}/usuarios/registrar` ? usuarioPolicy.register(user) : usuarioPolicy.edit(user)}
      >
        <UserForm />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/usuarios/:id/cambiar-contrasena`}
        authorize={(user) => usuarioPolicy.changePassword(user)}
      >
        <CambiarContrasenaForm />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/usuarios/cambiar-contrasena`}>
        <CambiarContrasenaForm />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/usuarios/:id`}
        authorize={(user) => usuarioPolicy.view(user)}
      >
        <UserView />
      </ProtectedRoute>
      
      <ProtectedRoute exact path={`${url}/roles`}
        authorize={rolPolicy.index}
      >
        <RolIndex />
      </ProtectedRoute>
      <ProtectedRoute exact path={[`${url}/roles/registrar`, `${url}/roles/:id/editar`]}
        authorize={(user, currentUrl) => currentUrl == `${url}/roles/registrar` ? rolPolicy.register(user) : rolPolicy.edit(user)}
      >
        <RolForm />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/roles/:id`}
        authorize={(user)=>rolPolicy.view(user)}
      >
        <RolView />
      </ProtectedRoute>
    </Switch>
  
  </SidebarLayout>
}

export default IamApp