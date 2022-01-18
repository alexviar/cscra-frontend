import { Alert, Breadcrumb, Button, Col, Form, Row } from 'react-bootstrap'
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import Skeleton from "react-loading-skeleton"
import { LatLngExpression } from "leaflet"
import { Proveedor, ProveedoresService } from '../services'
import { useQuery } from 'react-query'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useUser, ProtectedContent } from "../../../../commons/auth"
import { proveedorPolicy } from "../policies"
import "../../../../commons/utils/leafletDefaults"
import 'react-loading-skeleton/dist/skeleton.css'

export const ProveedorView = ()=>{

  const { pathname, state: locationState } = useLocation<{
    proveedor?: Proveedor
  }>()

  const { id } = useParams<{
    id: string
  }>()

  const tipo = id?.startsWith("EMP") ? 2 : id?.startsWith("MED") ? 1 : -1

  const userser = useUser()

  const cargar = useQuery(["cargar", id], ()=>{
    return ProveedoresService.cargar(id)
  }, {
    initialData: locationState?.proveedor && { status: 200, statusText: "OK", headers: {}, config: {}, data: locationState?.proveedor },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const proveedor = cargar.data?.data || locationState?.proveedor

  const position: LatLngExpression | null | undefined = proveedor?.ubicacion && [proveedor.ubicacion.latitud, proveedor.ubicacion.longitud]
    
  const renderAlert = () => {
    if(cargar.error) {
      const { response } = cargar.error as any
      return <Alert variant="danger">
        {
          !response ? "No fue posible realizar la solicitud, verifique si tiene conexion a internet" :
          response.status == 404 ? "El proveedor que busca no existe" : 
          "Ocurrio un error inesperado"
        }
      </Alert>
    }
    return null
  }

  return <div>
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{to: "/clinica/proveedores"}}>Proveedores</Breadcrumb.Item>
      <Breadcrumb.Item active>{id}</Breadcrumb.Item>
      <Breadcrumb.Item active>Detalles</Breadcrumb.Item>
    </Breadcrumb>
    {renderAlert()}
    <Row>
      <Col lg={5} md={4}>
        <dl className="form-row">
          <dt className="col-lg-5 col-md-12 col-sm-5">Tipo</dt>
          <dd className="col-lg-7 col-md-12 col-sm-7">{proveedor ? (proveedor.tipo == 1 ? "Médico" : proveedor?.tipo == 2 ? "Empresa" : null) : <Skeleton />}</dd>
          <dt className="col-lg-5 col-md-12 col-sm-5">NIT</dt>
          <dd className="col-lg-7 col-md-12 col-sm-7">{proveedor? proveedor.nit : <Skeleton />}</dd>
          {
            proveedor ? 
              proveedor.tipo == 1 ? <>
                  <dt className="col-lg-5 col-md-12 col-sm-5">Carnet de identidad</dt>
                  <dd className="col-lg-7 col-md-12 col-sm-7">{proveedor.ci.texto}</dd>
                  <dt className="col-lg-5 col-md-12 col-sm-5">Nombre</dt>
                  <dd className="col-lg-7 col-md-12 col-sm-7">{proveedor.nombreCompleto}</dd>
                  <dt className="col-lg-5 col-md-12 col-sm-5">Especialidad</dt>
                  <dd className="col-lg-7 col-md-12 col-sm-7">{proveedor.especialidad}</dd>
              </> : (proveedor.tipo == 2 ? <>
                <dt className="col-lg-5 col-md-12 col-sm-5">Nombre</dt>
                <dd className="col-lg-7 col-md-12 col-sm-7">{proveedor?.nombre}</dd>
              </> : null) :
              tipo == 1 ? <>
                  <dt className="col-lg-5 col-md-12 col-sm-5">Carnet de identidad</dt>
                  <dd className="col-lg-7 col-md-12 col-sm-7">{<Skeleton />}</dd>
                  <dt className="col-lg-5 col-md-12 col-sm-5">Nombre</dt>
                  <dd className="col-lg-7 col-md-12 col-sm-7">{<Skeleton />}</dd>
                  <dt className="col-lg-5 col-md-12 col-sm-5">Especialidad</dt>
                  <dd className="col-lg-7 col-md-12 col-sm-7">{<Skeleton />}</dd>
              </> : (tipo == 2 ? <>
                <dt className="col-lg-5 col-md-12 col-sm-5">Nombre</dt>
                <dd className="col-lg-7 col-md-12 col-sm-7">{<Skeleton />}</dd>
              </> : null)
          }
          <dt className="col-lg-5 col-md-12 col-sm-5">Regional</dt>
          <dd className="col-lg-7 col-md-12 col-sm-7">{proveedor ? proveedor.regional?.nombre : <Skeleton />}</dd>
          <dt className="col-lg-5 col-md-12 col-sm-5">Dirección</dt>
          <dd className="col-lg-7 col-md-12 col-sm-7">{proveedor ? proveedor.direccion : <Skeleton />}</dd>
          <dt className="col-lg-5 col-md-12 col-sm-5">Teléfono 1</dt>
          <dd className="col-lg-7 col-md-12 col-sm-7">{proveedor ? proveedor.telefono1 : <Skeleton />}</dd>
          <dt className="col-lg-5 col-md-12 col-sm-5">Teléfono 2</dt>
          <dd className="col-lg-7 col-md-12 col-sm-7">{proveedor ? proveedor.telefono2 || 'No proporcionado' : <Skeleton />}</dd>
        </dl>
      </Col>
      <Col lg={7} md={8}>
        {position !== undefined ? <MapContainer
          center={position||[-17.78629, -63.18117]}
          zoom={13} dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          style={{minHeight: 480, height: "100%"}}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {position ? <Marker position={position}>
            <Popup>
              <a href={`geo:${position.join(",")}`}>Abrir con</a>
            </Popup>
          </Marker> : null}
        </MapContainer> : <Skeleton style={{minHeight: 480}} />}
      </Col>
    </Row>
    {proveedor ? <Form.Row>
      <ProtectedContent
        authorize={(user)=>proveedorPolicy.edit(user, {regionalId: proveedor.regionalId})}
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
}