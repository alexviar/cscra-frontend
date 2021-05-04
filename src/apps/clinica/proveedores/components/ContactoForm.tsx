import { useState, useEffect } from "react"
import { Alert, Button, Col, Form, Modal, Spinner } from "react-bootstrap"
import { LatLngExpression } from "leaflet"
import { Controller, useForm } from "react-hook-form"
import { Link, useHistory, useParams } from "react-router-dom"
import { useQuery, useMutation } from "react-query"
import { Departamento, Provincia, Municipio } from "../../../../commons/services"
import { DepartamentosTypeahead, ProvinciasTypeahead, MunicipiosTypeahead, LocationInput } from "../../../../commons/components"
import * as rules from "../../../../commons/components/rules"
import { Proveedor, ProveedoresService } from "../services"
import { FaLessThanEqual } from "react-icons/fa"


type Inputs = {
  departamento: Departamento[]
  provincia: Provincia[]
  municipio: Municipio[]
  direccion: string,
  ubicacion: LatLngExpression
  telefono1: number,
  telefono2: number
}

type Props = {
  next?: ()=>void
}

export const ContactoForm = (props: Props)=>{
  const {id} = useParams<{id: string}>()
  const history = useHistory<{
    proveedor?: Proveedor,
  }>()
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [municipios, setMunicipios] = useState<Municipio[]>([])
  const [showLoader, setShowLoader] = useState(false)
  const {
    register,
    control,
    watch,
    formState
  } = useForm<Inputs>({
    defaultValues: {
      departamento: [],
      provincia: [],
      municipio: [],
      ubicacion: [-17.78629, -63.18117]
    }
  })

  const cargar = useQuery(["cargarProveedor", id], ()=>{
    return ProveedoresService.cargar(parseInt(id))
  }, {
    enabled: !history.location.state?.proveedor,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })

  const guardar = useMutation((values: Inputs) =>{
    let lat, lng
    if(Array.isArray(values.ubicacion)){
      [lat, lng] = values.ubicacion
    }
    else{
      ({lat, lng} = values.ubicacion)
    }
    return ProveedoresService.guardarInformacionDeContacto({
      municipioId: values.municipio[0].id,
      direccion: values.direccion,
      ubicacion: {
        latitud: lat,
        longitud: lng
      },
      telefono1: values.telefono1,
      telefono2: values.telefono2 || undefined
    })
  })

  const proveedor = history.location.state?.proveedor || cargar.data?.data

  useEffect(()=>{
    if(cargar.data){
      if(props.next){
        props.next()
      }
      else {
        history.replace(`/clinica/proveedores/${id || cargar.data.data.id}`)
      }
    }
  }, [cargar.data])

  useEffect(()=>{
    if(cargar.isLoading){
      setShowLoader(true)
    }
  }, [cargar.isLoading])

  const renderLoader = () =>{
    return <Modal centered show={showLoader} onHide={()=>{
      if(cargar.isError){
        setShowLoader(false)
      }
    }}>
      <Modal.Header>
        Cargando
      </Modal.Header>
      <Modal.Body>
        {cargar.isLoading ? <Spinner animation="border"></Spinner> : <Alert variant="danger">
          {cargar.error?.response?.message || cargar.error?.message}
        </Alert>}
      </Modal.Body>
    </Modal>
  }

  return <Form>
    {renderLoader()}
    <h1 style={{fontSize: "1.75rem"}}>Información de contacto</h1>
    <Form.Row>
      <Form.Group as={Col} sm={4}>
        <Form.Label>Departamento</Form.Label>
        <Controller
          name="departamento"
          control={control}
          rules={{
            required: rules.required()
          }}
          render={({field, fieldState})=>{
            return <DepartamentosTypeahead 
              id="contacto-form/departamentos"
              onLoad={(departamentos)=>{
                setDepartamentos(departamentos)
              }}
              isInvalid={!!fieldState.error}
              selected={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          }}
        />
      </Form.Group>
      <Form.Group as={Col} sm={4}>
        <Form.Label>Provincia</Form.Label>
        <Controller
          name="provincia"
          control={control}
          rules={{
            required: rules.required()
          }}
          render={({field, fieldState})=>{
            return <ProvinciasTypeahead
              id="contacto-form/provincias"
              onLoad={(provincias)=>{
                setProvincias(provincias)
              }}
              filterBy={(provincia) => {
                const departamento = watch("departamento")
                return !!departamento.length && provincia.departamentoId == departamento[0].id
              }}
              isInvalid={!!fieldState.error}
              selected={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          }}
        />
      </Form.Group>
      <Form.Group as={Col} sm={4}>
        <Form.Label>Municipio</Form.Label>
        <Controller
          name="municipio"
          control={control}
          render={({field, fieldState})=>{
            return <MunicipiosTypeahead
              id="contacto-form/municipios"
              onLoad={(municipios)=>{
                setMunicipios(municipios)
              }}
              filterBy={(municipio) => {
                const provincia = watch("provincia")
                return !!provincia.length && municipio.provinciaId == provincia[0].id
              }}
              isInvalid={!!fieldState.error}
              selected={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          }}
        />
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col}>
        <Form.Label>Direccion</Form.Label>
        <Form.Control as="textarea" />
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col}>
        <Form.Label>Ubicación</Form.Label>
        <Controller
          name="ubicacion"
          control={control}
          render={({field, fieldState})=>{
            console.log("Location", field)
            return <LocationInput
              center={field.value || [-17.78629, -63.18117]}
              value={field.value}
              onChange={field.onChange}
            />
          }}
        />
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} sm={4}>
        <Form.Label>Teléfono 1</Form.Label>
        <Form.Control
          isInvalid={!!formState.errors.telefono1}
          {...register("telefono1", {
            required: rules.required(),
            pattern: rules.pattern(/\d{7,8}/)
          })}
        />
        <Form.Control.Feedback>{formState.errors.telefono1?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} sm={4}>
        <Form.Label>Teléfono 2</Form.Label>
        <Form.Control
          isInvalid={!!formState.errors.telefono1}
          {...register("telefono1", {
            pattern: rules.pattern(/\d{7,8}/)
          })}
        />
        <Form.Control.Feedback>{formState.errors.telefono1?.message}</Form.Control.Feedback>
      </Form.Group>
    </Form.Row>
    <Button>
      {guardar.isLoading ? <Spinner animation="border" size="sm"/> : null}
      <span className="ml-2 align-middle">Guardar</span>
    </Button>
    {props.next ? <Button variant="link" onClick={()=>{
      props.next && props.next()
    }}
    >
      Omitir
    </Button> : null}
  </Form>
}