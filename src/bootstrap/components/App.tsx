import React, { useEffect, Suspense } from 'react';
import { Button, Col, Image, Navbar, Nav, NavDropdown, Popover, OverlayTrigger, Row } from 'react-bootstrap'
import {
  Switch,
  Route,
  Link,
} from "react-router-dom"
import { MdApps } from 'react-icons/md'
import { FaUserCircle, FaClinicMedical } from 'react-icons/fa'
import { QueryProgressModal, PdfModal } from "../../commons/components"
import { useNavTitle } from "../../commons/hooks"
import { useModal } from "../../commons/reusable-modal"
import { Login, ProtectedRoute, useUser, useLogout, useUnauthorizedEffect } from "../../commons/auth"
import { ToggleSidebar } from './ToggleSidebar'
import { Home } from './Home'
import "../../configs/yup"
import './App.css'

const IamApp = React.lazy(()=>import("../../apps/iam/IamApp"))
const ClinicaApp = React.lazy(()=>import("../../apps/clinica/ClinicaApp"))

export default ()=>{

  const modal = useModal("queryLoader")

  const navTitle = useNavTitle()

  useUnauthorizedEffect()
  
  const user = useUser()

  useEffect(()=>{
    if(user === null || user.isReady) modal.close()
    else if(user?.isLoading) modal.open({
      state: "loading",
      // message: "Cargando la información del usuario"
    })
    else if(user?.error) modal.open({
      state: "error",
      error: user.error
    })
  }, [user])

  const logout = useLogout()

  useEffect(()=>{
    if(logout.status === "success") modal.close()
    else if(logout.status === "error") modal.open({
      state: "error",
      error: logout.error
    })
  }, [logout.status])

  return <>
    <Navbar className="shadow-sm border-bottom" bg="primary" variant="dark" style={{zIndex: 1}}>
      <ToggleSidebar />
      <Navbar.Brand className="overflow-hidden text-truncate" as={Link} to="/" >
        <Image className="mx-1" width={32} src="/logo-sm.png" />
        {navTitle}
      </Navbar.Brand>
      <Nav className="ml-auto">
        <OverlayTrigger
          trigger="click"
          rootClose
          placement="bottom"
          overlay={
            <Popover id="apps" style={{maxWidth: "none"}}>
              <Popover.Title className="text-center" as="h3">Aplicaciones</Popover.Title>
              <Popover.Content>
                <Row>
                  <Col className="text-center"><Link to="/iam"><FaUserCircle className="d-block mx-auto" size={48} /><span >IAM</span></Link></Col>
                  <Col className="text-center"><Link to="/clinica" ><FaClinicMedical className="d-block mx-auto"  size={48} /><span>Clínica</span></Link></Col>
                  {/* <Col className="text-center"><Link to="/seguimiento" ><FaCalendar className="d-block mx-auto"  size={48} /><span>Planes</span></Link></Col> */}
               </Row>
              </Popover.Content>
            </Popover>
          }
        >
          <Nav.Link><MdApps size="1.5em" /></Nav.Link>
        </OverlayTrigger>
        {
          user === null ? <Nav.Link as={Link} className="text-nowrap" to="/login">Iniciar sesión</Nav.Link> :
          user.isReady ? <NavDropdown 
            // menuAlign="right"
            title={<>
              <FaUserCircle />
              <span className="d-none d-sm-inline ml-1">{user.username}</span>
            </>} id="collasible-nav-dropdown">
            {/* <NavDropdown.Item href="#action/3.2">Cuenta</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Configuracion</NavDropdown.Item> */}
            <NavDropdown.Item as={Link} to={`/iam/usuarios/cambiar-contrasena`}>Cambiar contraseña</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item as={Button} className="btn-link" onClick={()=>{
              modal.open({
                state: "loading"
              })
              logout.mutate()
            }} >Cerrar sesión</NavDropdown.Item>
          </NavDropdown> : null
        }
      </Nav>
    </Navbar>

    <QueryProgressModal />
    <PdfModal />
    <Suspense fallback={<div>Cargando...</div>}>
      <Switch>
        <ProtectedRoute path="/iam">
          <IamApp />
        </ProtectedRoute>
        <ProtectedRoute path="/clinica">
          <ClinicaApp />
        </ProtectedRoute>
        <Route exact path="/login">
          <Login></Login>
        </Route>        
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Suspense>
  </>
};
