import { Route, Switch, useRouteMatch } from 'react-router-dom';
import SidebarLayout from '../../commons/components/layouts/SidebarLayout';
import { FaCog, FaCoins } from 'react-icons/fa';
import { BiTransfer } from 'react-icons/bi';
import ListaMoraIndex from './mora/components/ListaMoraIndex';
import ListaMoraItemForm from './mora/components/ListaMoraItemForm';
import { Settings } from './settings/components/Settings';
import { SolicitudAtencionExternaIndex } from './solicitud_atencion_externa/components/SolicitudAtencionExternaIndex';
import { FcDebt } from '../../commons/components/icons/FcDebt';

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
        id: "configuracion",
        path: `${url}/configuracion`,
        title: "Configuración",
        icon: <FaCog />
      }
    ]
  }}>
    <Switch>
      <Route path={`${url}/lista-mora`}>
        <ListaMoraIndex />
      </Route>
      <Route exact path={`${url}/lista-mora/agregar`}>
        <ListaMoraItemForm />
      </Route>
      <Route path={`${url}/atencion-externa`}>
        <SolicitudAtencionExternaIndex />
      </Route>
      <Route exact path={`${url}/configuracion`} >
        <Settings />
      </Route>
    </Switch>
  </SidebarLayout>
}

export default ClinicaApp