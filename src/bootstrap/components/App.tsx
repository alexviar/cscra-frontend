import React, { useEffect } from 'react';
import { Button, Col, Navbar, Nav, Modal, NavDropdown, Popover, OverlayTrigger, Row } from 'react-bootstrap'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"
import { MdApps } from 'react-icons/md'
import { FaBell, FaUserCircle, FaBars, FaClinicMedical, FaUserPlus } from 'react-icons/fa'
import * as Apps from "../../apps";
import IamApp from "./IamApp";
import {Login, ProtectedRoute} from "../../features/auth/components"
import { getUser } from "../../features/auth/selectors/inputSelectors"
import { useDispatch, useSelector } from 'react-redux'
import '../../App.css';
import apiClient from '../../commons/services/apiClient';
import { unauthorized } from '../../features/auth/actions';

export default ()=>{
  const dispatch = useDispatch()
  const user = useSelector(getUser)


  const toggleSidebar = () => {
    dispatch({
      type:"TOGGLE_SIDEBAR"
    })
  }

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

  return <Router>
    <Navbar className="shadow-sm border-bottom" bg="white" variant="light" style={{zIndex: 1}}>
      {user ? <Navbar.Toggle style={{display: "initial"}} onClick={toggleSidebar} ><FaBars /></Navbar.Toggle> : null}
      <Navbar.Brand href="#home" className="ml-4">Hipócrates</Navbar.Brand>
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
        {user ? <OverlayTrigger
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
            {/* <Badge className="pulse" pill variant="danger">9</Badge> */}
            <div className="pulse bg-danger" style={{
              left: "0.65rem",
              top: "-1.35rem",
              width: "0.5rem",
              height: "0.5rem",
              borderRadius: "50%"
            }}></div>
          </Nav.Link>
        </OverlayTrigger> : null}
        {user ? <NavDropdown title={<><FaUserCircle /><span className="d-none d-sm-inline ml-1">{user.username}</span></>} id="collasible-nav-dropdown">
          <NavDropdown.Item href="#action/3.2">Cuenta</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.3">Configuracion</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item as={Button} className="btn-link" onClick={()=>{
            apiClient.post("logout").then(()=>{
              dispatch(unauthorized())
              localStorage.removeItem("user")
            })
          }} >Cerrar sesión</NavDropdown.Item>
        </NavDropdown> : <Nav.Link as={Link} to="/login">Iniciar sesión</Nav.Link>}
      </Nav>
    </Navbar>
        <Switch>
          <ProtectedRoute path="/iam">
            <IamApp />
          </ProtectedRoute>
          <ProtectedRoute path="/clinica">
            <Apps.ClinicaApp />
          </ProtectedRoute>
          <Route exact path="/login">
            <Login></Login>
          </Route>
        </Switch>
  </Router>
};
