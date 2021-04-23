import { Route, Switch, useRouteMatch } from 'react-router-dom';
import SidebarLayout from '../../commons/components/layouts/SidebarLayout';
import { FaCog, FaCoins, FaHandshake, FaUserMd } from 'react-icons/fa';
import { BiTransfer } from 'react-icons/bi';
import ListaMoraIndex from './mora/components/ListaMoraIndex';
import ListaMoraItemForm from './mora/components/ListaMoraItemForm';
import { Settings } from './settings/components/Settings';
import { SolicitudAtencionExternaIndex } from './solicitud_atencion_externa/components/SolicitudAtencionExternaIndex';
import { FcDebt } from '../../commons/components/icons/FcDebt';
import { SolicitudAtencionExternaForm } from './solicitud_atencion_externa/components/SolicitudAtencionExternaForm';
import { EspecialidadesIndex } from './especialidades/components/EspecialidadesIndex';
import { PrestacionesIndex, PrestacionForm } from './prestaciones/componentes';
import MedicosIndex from './medicos/components/MedicosIndex';
import MedicosForm from './medicos/components/MedicosForm';

export const ClinicaApp = ()=>{
  const { path, url } = useRouteMatch()

  return <SidebarLayout sidebar={{
    items: [
      {
        id: "lista-mora",
        path: `${url}/lista-mora`,
        title: "Lista de mora",
        icon: <FcDebt  />
      },
      {
        id: "atencion-externa",
        path: `${url}/atencion-externa`,
        title: "Atención exterana",
        icon: <BiTransfer />
      },
      {
        id: "configuracion/medicos",
        path: `${url}/medicos`,
        title: "Medicos",
        icon: <FaUserMd />,
      },
      {
        id: "configuracion/proveedores",
        path: `${url}/proveedores`,
        title: "Proveedores",
        icon: <FaHandshake />,
      },
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
    ]
  }}>
    <Switch>
      <Route exact path={`${url}/lista-mora/agregar`}>
        <ListaMoraItemForm />
      </Route>
      <Route path={`${url}/lista-mora`}>
        <ListaMoraIndex />
      </Route>
      <Route exact path={`${url}/atencion-externa`}>
        <SolicitudAtencionExternaIndex />
      </Route>
      <Route exact path={`${url}/atencion-externa/registrar`}>
        <SolicitudAtencionExternaForm />
      </Route>
      <Route exact path={`${url}/medicos`}>
        <MedicosIndex />
      </Route>
      <Route exact path={[`${url}/medicos/registrar`, `${url}/medicos/:id/editar`]}>
        <MedicosForm />
      </Route>
      <Route exact path={`${url}/configuracion/especialidades`}>
        <EspecialidadesIndex />
      </Route>
      <Route path={`${url}/configuracion/prestaciones`}>
        <PrestacionesIndex />
      </Route>
      {/* <Route exact path={`${url}/configuracion`} >
        <Settings />
      </Route> */}
    </Switch>
    
    <Route exact path={[`${url}/configuracion/prestaciones/registrar`, `${url}/configuracion/prestaciones/:id/editar`]}>
        <PrestacionForm />
      </Route>
  </SidebarLayout>
}

export default ClinicaApp