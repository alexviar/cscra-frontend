import { useMemo } from "react"
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import SidebarLayout from '../../commons/components/layouts/SidebarLayout';
import { FaCog, /*FaCoins,*/ FaHandshake, FaUserMd } from 'react-icons/fa';
import { BiTransfer } from 'react-icons/bi';
import ListaMoraIndex from './mora/components/ListaMoraIndex';
import ListaMoraItemForm from './mora/components/ListaMoraItemForm';
import { FcDebt } from '../../commons/components/icons/FcDebt';
import { SolicitudAtencionExternaIndex } from './solicitud_atencion_externa/components/SolicitudAtencionExternaIndex';
import { SolicitudAtencionExternaForm } from './solicitud_atencion_externa/components/SolicitudAtencionExternaForm';
import { SolicitudATPolicy } from './solicitud_atencion_externa/policies';
import { EspecialidadesIndex } from './especialidades/components/EspecialidadesIndex';
import { PrestacionesIndex, PrestacionForm } from './prestaciones/componentes';
import { MedicosIndex, MedicosForm, MedicoPolicy } from './medicos';
import { 
  ProveedoresIndex,
  ProveedorView,
  ProveedorWizard,
  ProveedorForm,
  ContactoForm,
  ContratoForm,
  ProveedorPolicy
} from './proveedores';
import { Permisos, ProtectedRoute, useLoggedUser } from '../../commons/auth';

export const ClinicaApp = ()=>{
  const { url } = useRouteMatch()
  const loggedUser = useLoggedUser()

  const sidebarItems = useMemo(()=>{
    const items = [] as any[]

    items.push(
      {
        id: "lista-mora",
        path: `${url}/lista-mora`,
        title: "Lista de mora",
        icon: <FcDebt  />
      }
    )

    if(SolicitudATPolicy.index(loggedUser)) {
      items.push({
        id: "atencion-externa",
        path: `${url}/atencion-externa`,
        title: "Atención externa",
        icon: <BiTransfer />
      })
    }
    if(MedicoPolicy.index(loggedUser)){
      items.push({
        id: "medicos",
        path: `${url}/medicos`,
        title: "Medicos",
        icon: <FaUserMd />,
      })
    }
    if(ProveedorPolicy.index(loggedUser)){
      items.push({
        id: "proveedores",
        path: `${url}/proveedores`,
        title: "Proveedores",
        icon: <FaHandshake />
      })
    }

    items.push(
      {
        id: "configuracion",
        // path: `${url}/configuracion`,
        title: "Configuración",
        icon: <FaCog />,
        items: [
          {
            id: "configuracion/especialidades",
            path: `${url}/configuracion/especialidades`,
            title: "Especialidades",
            icon: <FaCog />,
          },
          {
            id: "configuracion/prestaciones",
            path: `${url}/configuracion/prestaciones`,
            title: "Servicios subrogados",
            icon: <FaCog />,
          }
        ]
      }
    )
    return items
  }, [loggedUser])

  return <SidebarLayout sidebar={{
    items: sidebarItems
  }}>
    <Switch>
      <Route exact path={`${url}/lista-mora/agregar`}>
        <ListaMoraItemForm />
      </Route>
      <Route path={`${url}/lista-mora`}>
        <ListaMoraIndex />
      </Route>
      <ProtectedRoute exact path={`${url}/atencion-externa`}
        authorize={SolicitudATPolicy.index}>
        <SolicitudAtencionExternaIndex />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/atencion-externa/registrar`}
        authorize={SolicitudATPolicy.register}
      >
        <SolicitudAtencionExternaForm />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/medicos`}
        authorize={MedicoPolicy.index}
      >
        <MedicosIndex />
      </ProtectedRoute>
      <ProtectedRoute exact path={[`${url}/medicos/registrar`, `${url}/medicos/:id/editar`]}
        authorize={(user, path) => path == `${url}/medicos/registrar` ? MedicoPolicy.register(user) : MedicoPolicy.edit(user) }
      >
        <MedicosForm />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/proveedores`}
        authorize={ProveedorPolicy.index}
      >
        <ProveedoresIndex />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/proveedores/:id`}
        authorize={ProveedorPolicy.view}
      >
        <ProveedorView />
      </ProtectedRoute>
      <ProtectedRoute exact path={[`${url}/proveedores/registrar`, ]}
        authorize={ProveedorPolicy.register}
      >
        <ProveedorWizard />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/proveedores/:id/editar`}
        authorize={ProveedorPolicy.edit}>
        <ProveedorForm />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/proveedores/:id/editar-contacto`}
        authorize={(user)=>ProveedorPolicy.register(user) || ProveedorPolicy.edit(user)}
      >
        <ContactoForm />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/proveedores/:idProveedor/contratos/registrar`}
        authorize={(user)=>ProveedorPolicy.register(user) || ProveedorPolicy.edit(user)}
      >
        <ContratoForm />
      </ProtectedRoute>
      <Route exact path={`${url}/configuracion/especialidades`}>
        <EspecialidadesIndex />
      </Route>
      <Route path={`${url}/configuracion/prestaciones`}>
        <PrestacionesIndex />
      </Route>
    </Switch>
    
    <Route exact path={[`${url}/configuracion/prestaciones/registrar`, `${url}/configuracion/prestaciones/:id/editar`]}>
        <PrestacionForm />
      </Route>
  </SidebarLayout>
}

export default ClinicaApp