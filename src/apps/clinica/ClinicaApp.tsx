import { useMemo } from "react"
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import SidebarLayout from '../../commons/components/layouts/SidebarLayout';
import { FaProcedures, /*FaCoins,*/ FaHandshake, FaUserMd } from 'react-icons/fa';  
import { GiRodOfAsclepius } from 'react-icons/gi';  
import { BiTransfer } from 'react-icons/bi';
import ListaMoraIndex from './mora/components/ListaMoraIndex';
import ListaMoraItemForm from './mora/components/ListaMoraItemForm';
import { FcDebt } from '../../commons/components/icons/FcDebt';
import { SolicitudAtencionExternaIndex } from './solicitud_atencion_externa/components/SolicitudAtencionExternaIndex';
import { SolicitudAtencionExternaForm } from './solicitud_atencion_externa/components/SolicitudAtencionExternaForm';
import { SolicitudATPolicy } from './solicitud_atencion_externa/policies';
import { EspecialidadesIndex, EspecialidadForm } from './especialidades/components';
import { PrestacionesIndex, PrestacionForm } from './prestaciones/componentes';
import { MedicosIndex, MedicoView, MedicosForm, MedicoPolicy } from './medicos';
import { 
  ProveedoresIndex,
  ProveedorView,
  ProveedorWizard,
  ProveedorForm,
  ContactoForm,
  ProveedorPolicy
} from './proveedores';
import {
  ContratoForm,
  ContratoView,
  ContratoPolicy
} from './contratos'
import { Permisos, ProtectedRoute, useLoggedUser } from '../../commons/auth';
import { ListaMoraPolicy } from "./mora/policies";
import { Image } from "react-bootstrap";

export const ClinicaApp = ()=>{
  const { url } = useRouteMatch()
  const loggedUser = useLoggedUser()

  const sidebarItems = useMemo(()=>{
    const items = [] as any[]

    if(ListaMoraPolicy.index(loggedUser)){
      items.push(
        {
          id: "lista-mora",
          path: `${url}/lista-mora`,
          title: "Lista de mora",
          icon: <FcDebt  />
        }
      )
    }

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
            id: "especialidades",
            path: `${url}/especialidades`,
            title: "Especialidades",
            icon: <GiRodOfAsclepius />,
          },
          {
            id: "prestaciones",
            path: `${url}/prestaciones`,
            title: "Prestaciones",
            icon: <FaProcedures />,
          }
    )
    return items
  }, [loggedUser])

  return <SidebarLayout sidebar={{
    header: <div className="d-flex justify-content-center"><Image src="/logo-lg.png" /></div>,
    items: sidebarItems
  }}>
    <Switch>
      <ProtectedRoute exact path={`${url}/lista-mora/agregar`}
        authorize={ListaMoraPolicy.index}>
        <ListaMoraItemForm />
      </ProtectedRoute>
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
      <ProtectedRoute exact path={`${url}/medicos/:id`}
        authorize={MedicoPolicy.view}
      >
        <MedicoView />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/proveedores`}
        authorize={ProveedorPolicy.index}
      >
        <ProveedoresIndex />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/proveedores/registrar`}
        authorize={ProveedorPolicy.register}
      >
        <ProveedorWizard />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/proveedores/:id`}
        authorize={ProveedorPolicy.view}
      >
        <ProveedorView />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/proveedores/:id/editar`}
        authorize={ProveedorPolicy.edit}>
        <ProveedorForm />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/proveedores/:idProveedor/editar-contacto`}
        authorize={(user)=>ProveedorPolicy.register(user) || ProveedorPolicy.edit(user)}
      >
        <ContactoForm />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/proveedores/:idProveedor/contratos/registrar`}
        authorize={ContratoPolicy.register}
      >
        <ContratoForm />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/proveedores/:idProveedor/contratos/:id`}
        authorize={ProveedorPolicy.view}
      >
        <ContratoView />
      </ProtectedRoute>
      <Route path={`${url}/especialidades`}>
        <EspecialidadesIndex />
      </Route>
      <Route path={`${url}/prestaciones`}>
        <PrestacionesIndex />
      </Route>
    </Switch>
    
    <Route exact path={[`${url}/prestaciones/registrar`, `${url}/prestaciones/:id/editar`]}>
      <PrestacionForm />
    </Route>
    <Route exact path={[`${url}/especialidades/registrar`, `${url}/especialidades/:id/editar`]}>
      <EspecialidadForm />
    </Route>
  </SidebarLayout>
}

export default ClinicaApp