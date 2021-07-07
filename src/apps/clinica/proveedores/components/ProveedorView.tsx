import { useEffect, useRef } from 'react'
import { Button, Col, Form, Row, Tab, Tabs, Table } from 'react-bootstrap'
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import L, { LatLngExpression } from "leaflet"
import { Proveedor, ProveedoresService } from '../services'
import { useQuery } from 'react-query'
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
    return <dl className="form-row">
        <dt className="col-sm-3 col-md-2">Tipo</dt>
        <dd className="col-sm-9 col-md-10">{proveedor?.tipoId == 1 ? "Médico" : proveedor?.tipoId == 2 ? "Empresa" : null}</dd>
        <dt className="col-sm-3 col-md-2" style={{width: '1px'}}>NIT</dt>
        <dd className="col-sm-9 col-md-10">{proveedor?.nit}</dd>
      {proveedor?.tipoId == 1 ? 
        <>
            <dt className="col-sm-3 col-md-2" style={{width: 1}}>Carnet de identidad</dt>
            <dd className="col-sm-9 col-md-10">{proveedor?.ciText}</dd>
            <dt className="col-sm-3 col-md-2" style={{width: 1}}>Nombre</dt>
            <dd className="col-sm-9">{proveedor?.nombreCompleto}</dd>
            <dt className="col-sm-3 col-md-2">Especialidad</dt>
            <dd className="col-sm-9 col-md-10">{proveedor?.especialidad?.nombre}</dd>
        </> : (proveedor?.tipoId == 2 ? <>
          <dt className="col-sm-3 col-md-2" style={{width: 1}}>Nombre</dt>
          <dd className="col-sm-9 col-md-10">{proveedor?.nombre}</dd>
        </> : null)}
        <dt className="col-sm-3 col-md-2">Regional</dt>
        <dd className="col-sm-9 col-md-10">{proveedor?.regional?.nombre}</dd>
    </dl>
  }

  const renderContactInfo = ()=>{
    if(!proveedor) return null
    const position: LatLngExpression = proveedor.ubicacion && [proveedor.ubicacion.latitud, proveedor.ubicacion.longitud]
    return <Row className="px-2 py-3">
      <Col sm={6}>
        <dl className="form-row">
          <dt className="col-lg-5 col-xl-4">Departamento</dt>
          <dd className="col-lg-7 col-xl-8">{proveedor.municipio?.provincia?.departamento?.nombre || 'No proporcionado'}</dd>
          <dt className="col-lg-5 col-xl-4">Provincia</dt>
          <dd className="col-lg-7 col-xl-8">{proveedor.municipio?.provincia?.nombre || 'No proporcionado'}</dd>
          <dt className="col-lg-5 col-xl-4">Municipio</dt>
          <dd className="col-lg-7 col-xl-8">{proveedor.municipio?.nombre || 'No proporcionado'}</dd>
          <dt className="col-lg-5 col-xl-4">Dirección</dt>
          <dd className="col-lg-7 col-xl-8">{proveedor.direccion || 'No proporcionado'}</dd>
          <dt className="col-lg-5 col-xl-4">Teléfono 1</dt>
          <dd className="col-lg-7 col-xl-8">{proveedor.telefono1 || 'No proporcionado'}</dd>
          <dt className="col-lg-5 col-xl-4">Teléfono 2</dt>
          <dd className="col-lg-7 col-xl-8">{proveedor.telefono2 || 'No proporcionado'}</dd>
        </dl>
      </Col>
      <Col sm={6}>
        <MapContainer center={position} zoom={14} dragging={false} scrollWheelZoom={false} doubleClickZoom={false} style={{minHeight: 200, height: "100%"}}>
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
      {renderGeneralInfo()}      
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