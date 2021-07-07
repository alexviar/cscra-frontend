import React, { useEffect, Suspense } from 'react';
import { Button, Col, Image, Navbar, Nav, NavDropdown, Popover, OverlayTrigger, Row } from 'react-bootstrap'
import {
  Switch,
  Route,
  Link,
} from "react-router-dom"
import { MdApps } from 'react-icons/md'
import { FaBell, FaUserCircle, FaBars, FaClinicMedical } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryClient } from 'react-query'
import { QueryProgressModal } from "../../commons/components"
import { useModal } from "../../commons/reusable-modal"
import {Login, ProtectedRoute} from "../../commons/auth/components"
import { getUser } from "../../commons/auth/selectors/inputSelectors"
import { AuthService } from '../../commons/auth/services';
import { apiClient } from '../../commons/services';
import { unauthorized } from '../../commons/auth/actions';
import { ToggleSidebar } from './ToggleSidebar'
import "../../configs/yup"
import '../../App.css';

const IamApp = React.lazy(()=>import("../../apps/iam/IamApp"))
const ClinicaApp = React.lazy(()=>import("../../apps/clinica/ClinicaApp"))

export default ()=>{
  const dispatch = useDispatch()
  const user = useSelector(getUser)

  const modal = useModal("queryLoader")

  const queryClient = useQueryClient()

  useEffect(()=>{
    apiClient.interceptors.response.use(
      response=>response,
      error => {
        if(error.response?.status == 401 || error.response?.status == 419){
          dispatch(unauthorized())
        }
        return Promise.reject(error);
      }
    )

    const jsonUser = localStorage.getItem("user")
    dispatch({
      type: "SET_USER",
      payload: jsonUser ? JSON.parse(jsonUser) : null
    })
    // apiClient.get('/user')
  }, [])

  return <>
    <Navbar className="shadow-sm border-bottom" bg="primary" variant="dark" style={{zIndex: 1}}>
      <ToggleSidebar />
      <Navbar.Brand className="overflow-hidden text-truncate" as={Link} to="/" >
        <Image className="mx-1" width={32} src="/logo-sm.png" />
        Transferencias - DM11
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
               </Row>
              </Popover.Content>
            </Popover>
          }
        >
          <Nav.Link><MdApps size="1.5em" /></Nav.Link>
        </OverlayTrigger>
        {/* {user ? <OverlayTrigger
          trigger="click"
          rootClose
          placement="bottom"
          overlay={
            <Popover id="apps">
              <Popover.Title className="text-center" as="h3">Notificaciones</Popover.Title>
              <Popover.Content>
                
              </Popover.Content>
            </Popover>
          }
        >
          <Nav.Link style={{whiteSpace: "nowrap"}}>
            <FaBell />
            <div className="pulse bg-danger" style={{
              left: "0.65rem",
              top: "-1.35rem",
              width: "0.5rem",
              height: "0.5rem",
              borderRadius: "50%"
            }}></div>
          </Nav.Link>
        </OverlayTrigger> : null} */}
        {user ? <NavDropdown 
          menuAlign="right"
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
            AuthService.logout().then(()=>{
              localStorage.removeItem("user")
              queryClient.clear()
              dispatch(unauthorized())
              modal.close()
            }).catch((error)=>modal.open({
              state: "error",
              error
            }))
          }} >Cerrar sesión</NavDropdown.Item>
        </NavDropdown> : <Nav.Link as={Link} className="text-nowrap" to="/login">Iniciar sesión</Nav.Link>}
      </Nav>
    </Navbar>

    <QueryProgressModal />
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
      </Switch>
    </Suspense>
  </>
};
