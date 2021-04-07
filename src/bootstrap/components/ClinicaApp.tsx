import React, { useCallback, useState, useEffect, useRef, DependencyList, MutableRefObject} from 'react';
import { Container, DropdownButton, Col, Table, FormControlProps, Navbar, Nav, Spinner, Modal, NavDropdown, Badge, Popover, OverlayTrigger, Row } from 'react-bootstrap'
import { Sidebar } from '../../commons/components/Sidebar';
import { useSelector } from 'react-redux';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import SidebarLayout from '../../commons/components/layouts/SidebarLayout';
import { FaCoins } from 'react-icons/fa';
import ListaMoraIndex from '../../features/mora/components/ListaMoraIndex';
import ListaMoraItemForm from '../../features/mora/components/ListaMoraItemForm';

export default ()=>{  
  const showSidebar = useSelector((state:any)=>state.main.showSidebar)
  const { path, url } = useRouteMatch()

  return <SidebarLayout sidebar={{
    items: [
      {
        id: "lista-mora",
        path: `${url}/lista-mora`,
        title: "Lista de mora",
        icon: <FaCoins />
      }
    ]
  }}>
    <Switch>
      <Route exact path={`${url}/lista-mora`}>
        <ListaMoraIndex />
      </Route>
      <Route exact path={`${url}/lista-mora/agregar`}>
        <ListaMoraItemForm />
      </Route>
    </Switch>
  </SidebarLayout>
}
