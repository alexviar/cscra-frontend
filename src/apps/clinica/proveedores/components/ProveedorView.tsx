import { useEffect, useRef } from 'react'
import { Button, Col, Form, Row, Tab, Tabs, Table } from 'react-bootstrap'
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import L, { LatLngExpression } from "leaflet"
import { Proveedor, ProveedoresService } from '../services'
import { useQuery, useMutation } from 'react-query'
import { FaEdit } from 'react-icons/fa'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useLoggedUser, ProtectedContent } from "../../../../commons/auth"
import { useModal } from "../../../../commons/reusable-modal"
import { ContratosIndex } from "../../contratos/components"
import { ProveedorPolicy } from "../policies"

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25,41],
    iconAnchor: [12,41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export const ProveedorView = ()=>{
  const { pathname, state: locationState } = useLocation<{
    proveedor?: Proveedor,
    tab?: string
  }>()
  const { id } = useParams<{
    id: string
  }>()

  const loggedUser = useLoggedUser()

  const loader = useModal("queryLoader")

  const cargar = useQuery(["cargar", id], ()=>{
    return ProveedoresService.cargar(parseInt(id))
  }, {
    enabled: !locationState?.proveedor,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: () => {
      loader.close()
    },
    onError: (error) => {
      loader.open({
        state: "error",
        error
      })
    }
  })

  const proveedor = cargar.data?.data || locationState?.proveedor

  useEffect(()=>{
    if(cargar.isFetching){
      loader.open({state: "loading"})
    }
  }, [cargar.isFetching])


  const renderGeneralInfo = ()=>{
    return <tbody>
      <tr>
        <th scope="row">Tipo</th>
        <td >{proveedor?.tipoId == 1 ? "Médico" : proveedor?.tipoId == 2 ? "Empresa" : null}</td>
      </tr>
      <tr>
        <th scope="row" style={{width: '1px'}}>NIT</th>
        <td>{proveedor?.nit}</td>
      </tr>
      {proveedor?.tipoId == 1 ? 
        <>
          <tr>
            <th scope="row" style={{width: 1}}>Carnet de identidad</th>
            <td>{proveedor?.ciText}</td>
          </tr>
          <tr>
            <th scope="row" style={{width: 1}}>Nombre</th>
            <td>{proveedor?.nombreCompleto}</td>
          </tr>
          <tr>
            <th scope="row">Especialidad</th>
            <td>{proveedor?.especialidad?.nombre}</td>
          </tr>
        </> : (proveedor?.tipoId == 2 ?
        <tr>
          <th scope="row" style={{width: 1}}>Nombre</th>
          <td>{proveedor?.nombre}</td>
        </tr> : null)}
      <tr>
        <th scope="row">Regional</th>
        <td>{proveedor?.regional?.nombre}</td>
      </tr>
    </tbody>
  }

  const renderContactInfo = ()=>{
    if(!proveedor) return null
    const position: LatLngExpression = proveedor.ubicacion && [proveedor.ubicacion.latitud, proveedor.ubicacion.longitud]
    return <Row className="py-3">
      <Col>
        <Table>
          <tbody>
            <tr>
              <th scope="row">Departamento</th>
              <td >{proveedor.municipio?.provincia?.departamento?.nombre}</td>
            </tr>
            <tr>
              <th scope="row">Provincia</th>
              <td>{proveedor.municipio?.provincia?.nombre}</td>
            </tr>
            <tr>
              <th scope="row">Municipio</th>
              <td>{proveedor.municipio?.nombre}</td>
            </tr>
            <tr>
              <th scope="row">Dirección</th>
              <td>{proveedor.direccion}</td>
            </tr>
            <tr>
              <th scope="row">Teléfono 1</th>
              <td>{proveedor.telefono1}</td>
            </tr>
            <tr>
              <th scope="row">Teléfono 2</th>
              <td>{proveedor.telefono2}</td>
            </tr>
          </tbody>
        </Table>
      </Col>
      <Col>
        <MapContainer center={position} zoom={14} dragging={false} scrollWheelZoom={false} doubleClickZoom={false} style={{height: "100%"}}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {position ? <Marker position={position}>
            <Popup>
              <a href={`geo:${position.join(",")}`}>Abrir con</a>
            </Popup>
          </Marker> : null}
        </MapContainer>
      </Col>
    </Row>
  }
  
  return <>
    <h2 style={{fontSize: "1.75rem"}}>Proveedor</h2>
    <div id="general-info">
      <Table>
        {renderGeneralInfo()}
      </Table>
      
      {proveedor ? <Form.Row>
        <ProtectedContent
          authorize={ProveedorPolicy.edit}
        >
          <Col xs="auto">
            <Button as={Link} to={{
              pathname: `/clinica/proveedores/${proveedor.id}/editar`,
              state: {
                proveedor
              }
            }} >Editar</Button>
          </Col>
        </ProtectedContent>
        {/* <Col xs="auto">
          <Button variant="danger" onClick={()=>{
            modalRef.current?.show(true)
            eliminar.mutate()
          }}>
            {eliminar.isLoading ? <Spinner className="mr-2" animation="border" size="sm" /> : null}
            Eliminar
          </Button>
        </Col> */}
      </Form.Row> : null}
    </div>
    
    <Tabs className={"my-2"} defaultActiveKey={locationState?.tab}>
      <Tab eventKey="informacion-contacto" title="Informacion de Contacto">
        {renderContactInfo()}
        {proveedor ? <Form.Row>
          <ProtectedContent
            authorize={ProveedorPolicy.edit}
          >
            <Col xs="auto">
              <Button as={Link} to={{
                pathname: `/clinica/proveedores/${proveedor.id}/editar-contacto`,
                state: {
                  proveedor
                }
              }} >Editar</Button>
            </Col>
          </ProtectedContent>
        </Form.Row> : null}
      </Tab>
      <Tab eventKey="contratos" title="Contratos">
        <ContratosIndex />
      </Tab>
    </Tabs>
  </>
}