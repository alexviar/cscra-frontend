import { useMemo } from "react"
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import SidebarLayout from '../../commons/components/layouts/SidebarLayout';
import { FaProcedures, /*FaCoins,*/ FaHandshake, FaUserMd } from 'react-icons/fa';  
import { GiRodOfAsclepius } from 'react-icons/gi';  
import { FcDebt } from '../../commons/components/icons/FcDebt';
import { BiTransfer } from 'react-icons/bi';
import ListaMoraIndex from './mora/components/ListaMoraIndex';
import ListaMoraItemForm from './mora/components/ListaMoraItemForm';
import { listaMoraPolicy } from "./mora/policies";
import { 
  SolicitudAtencionExternaIndex,
  SolicitudAtencionExternaForm,
  solicitudAtencionExternaPolicy
} from './solicitud_atencion_externa';
import { 
  MedicosIndex, 
  MedicoView, 
  MedicoForm, 
  medicoPolicy } from './medicos';
import { 
  ProveedoresIndex,
  ProveedorView,
  ProveedorForm,
  proveedorPolicy } from "./proveedores"
import { ProtectedRoute, useUser } from '../../commons/auth';
import { superUserPolicyEnhancer } from '../../commons/auth/utils';
import { Image } from "react-bootstrap";

export const ClinicaApp = ()=>{
  const { url } = useRouteMatch()
  const user = useUser()

  const sidebarItems = useMemo(()=>{
    const items = [] as any[]

    if(superUserPolicyEnhancer(listaMoraPolicy.index)(user)){
      items.push(
        {
          id: "lista-mora",
          path: `${url}/lista-mora`,
          title: "Lista de mora",
          icon: <FcDebt  />
        }
      )
    }
    
    if(superUserPolicyEnhancer(solicitudAtencionExternaPolicy.index)(user)) {
      items.push({
        id: "atencion-externa",
        path: `${url}/atencion-externa`,
        title: "Atención externa",
        icon: <BiTransfer />
      })
    }

    if(superUserPolicyEnhancer(medicoPolicy.index)){
      items.push({
        id: "medicos",
        path: `${url}/medicos`,
        title: "Medicos",
        icon: <FaUserMd />,
      })
    }

    if(superUserPolicyEnhancer(proveedorPolicy.index)(user)){
      items.push({
        id: "proveedores",
        path: `${url}/proveedores`,
        title: "Proveedores",
        icon: <FaHandshake />
      })
    }

    // items.push(
    //       {
    //         id: "especialidades",
    //         path: `${url}/especialidades`,
    //         title: "Especialidades",
    //         icon: <GiRodOfAsclepius />,
    //       },
    //       {
    //         id: "prestaciones",
    //         path: `${url}/prestaciones`,
    //         title: "Prestaciones",
    //         icon: <FaProcedures />,
    //       }
    // )
    return items
  }, [user])

  return <SidebarLayout sidebar={{
    header: <div className="d-flex justify-content-center"><Image src="/logo-lg.png" /></div>,
    items: sidebarItems
  }}>
    <Switch>
      <ProtectedRoute exact path={`${url}/lista-mora/agregar`}
        authorize={(user) => listaMoraPolicy.register(user)}>
        <ListaMoraItemForm />
      </ProtectedRoute>
      <ProtectedRoute path={`${url}/lista-mora`}
        authorize={listaMoraPolicy.index}>
        <ListaMoraIndex />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/atencion-externa`}
        authorize={solicitudAtencionExternaPolicy.index}>
        <SolicitudAtencionExternaIndex />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/atencion-externa/registrar`}
        authorize={(user) => solicitudAtencionExternaPolicy.register(user)}
      >
        <SolicitudAtencionExternaForm />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/medicos`}
        authorize={medicoPolicy.index}
      >
        <MedicosIndex />
      </ProtectedRoute>
      <ProtectedRoute exact path={[`${url}/medicos/registrar`, `${url}/medicos/:id/editar`]}
        authorize={(user, path) => path == `${url}/medicos/registrar` ? medicoPolicy.register(user) : medicoPolicy.edit(user) }
      >
        <MedicoForm />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/medicos/:id`}
        authorize={(user)=>medicoPolicy.view(user)}
      >
        <MedicoView />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/proveedores`}
        authorize={proveedorPolicy.index}
      >
        <ProveedoresIndex />
      </ProtectedRoute>
      <ProtectedRoute exact path={[`${url}/proveedores/registrar`, `${url}/proveedores/:id/editar`]}
        authorize={(user, path)=> path == `${url}/proveedores/registrar` ? proveedorPolicy.register(user) : proveedorPolicy.edit(user)}
      >
        <ProveedorForm />
      </ProtectedRoute>
      <ProtectedRoute exact path={`${url}/proveedores/:id`}
        authorize={(user)=>proveedorPolicy.view(user)}
      >
        <ProveedorView />
      </ProtectedRoute>
    </Switch>
  </SidebarLayout>
}

export default ClinicaApp