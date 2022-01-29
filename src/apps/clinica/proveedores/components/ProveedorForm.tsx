import { useEffect } from "react"
import { Alert, Button, Breadcrumb, Col, Form, Spinner } from "react-bootstrap"
import { Link, useHistory, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useForm, FormProvider } from "react-hook-form"
import { Inputs as ProveedorInputs, ProveedorFieldset } from "./ProveedorFieldset"
import { Inputs as ContactoInputs, ContactoFieldset } from "./ContactoFieldset"
import { Proveedor, Empresa, Medico, InformacionContacto, ProveedoresService } from "../services"
import { AxiosError } from "axios"
import { useServerValidation } from "../../../../commons/hooks"
import { Regional } from "../../../../commons/services"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

type Inputs = ProveedorInputs & ContactoInputs

const schema = yup.object().shape({
  tipo: yup.number().required().oneOf([1,2]),
  nit: yup.string().trim().label("NIT")
    .matches(/^[0-9]*$/, "Este campo solo admite números").required(),
  ci: yup.number().label("número de carnet")
    .nonEmpty()
    .typeError("El ${path} no es un numero valido")
    .when("tipo", function(tipo: any, schema: any) {
      if(tipo == 1) return schema.required()
      return schema.optional()
    }),
  ciComplemento: yup.string().label("complemento del carnet").nonEmpty().uppercase().default(null).nullable().notRequired()
    .when("tipo", {
      is: (tipo: any) => tipo == 1,
      then: (schema) => schema.matches(/^[1-9][A-Z]$/, "Complemento invalido.")
    }),
  apellidoPaterno: yup.string().label("apellido paterno").nonEmpty().uppercase().default(null).nullable()
    .when(["tipo", "apellidoMaterno"], {
      is: (tipo: number, apellidoMaterno: string) => tipo == 1 && !apellidoMaterno,
      then: (schema) => schema.required("Debe proporcionar al menos un apellido").max(25)
    }),
  apellidoMaterno: yup.string().trim().label("apellido materno").nonEmpty().uppercase().default(null).nullable()
  .when(["tipo", "apellidoPaterno"], {
    is: (tipo: number, apellidoPaterno: string) => tipo == 1 && !apellidoPaterno,
    then: (schema) => schema.required("Debe proporcionar al menos un apellido").max(25)
  }),
  nombre: yup.string().label("nombre").nonEmpty().uppercase().required().label("nombre")
    .when("tipo", function(tipo: any, schema: any) {
      return tipo ==  1 ? schema.max(50) : schema.max(100)
    }),
  especialidad: yup.string().label("especialidad").nonEmpty().uppercase()
    .when("tipo", function(tipo: any, schema: any) {
      return tipo ==  1 ? schema.required("Debe indicar una especialidad") : schema.optional()
    }),
  regional: yup.array().length(1, "Debe indicar una regional").required(),

  direccion: yup.string().label("dirección").nonEmpty().uppercase().required().max(80),
  ubicacion: yup.mixed().label("ubicación").required(),
  telefono1: yup.number().label("telefono 1")
    .nonEmpty()
    .typeError("No es un numero válido").required(),
  telefono2: yup.number().label("telefono 2")
    .nonEmpty()
    .typeError("No es un numero válido").nullable().notRequired()
}, [["apellidoMaterno", "apellidoPaterno"]])


export const ProveedorForm = () => {

  const { id } = useParams<{id?: string}>()
  const history = useHistory<{
    proveedor?: Proveedor
  }>()


  const formMethods = useForm<Inputs>({
    resolver: yupResolver(schema),
    defaultValues: !id || id.startsWith("MED") ? {
      tipo: 1,
      initialized: !id,
      ciComplemento: null,
      regional: [],
      direccion: "",
      ubicacion: null
    } : {
      tipo: 2,
      initialized: !id,
      regional: [],
      direccion: "",
      ubicacion: null
    }
  })

  const {
    formState,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch
  } = formMethods

  // if(Object.keys(formState.errors).length !== 0) console.log(formState.errors, watch())

  const initialized = watch("initialized")

  const queryClient = useQueryClient()

  const cargar = useQuery(["proveedores", "cargar", id], () => {
    return ProveedoresService.cargar(id!)
  }, {
    enabled: !!id && !initialized,
    initialData: history.location.state?.proveedor && {status: 200, statusText: "OK", data: history.location.state.proveedor, headers: {}, config: {}},
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onError(){
      setValue("initialized", true)
    }
  })

  useEffect(()=>{
    if(cargar.data){
      const { data } = cargar.data
      setValue("initialized", true)
      setValue("tipo", data.tipo)
      setValue("nit", data.nit)
      setValue("nombre", data.nombre)
      setValue("regional", [data.regional as Regional])
      setValue("direccion", data.direccion)
      setValue("ubicacion", data.ubicacion && [data.ubicacion.latitud, data.ubicacion.longitud])
      setValue("telefono1", data.telefono1)
      setValue("telefono2", data.telefono2)
      if(data.tipo == 1){
        setValue("ci", data.ci.raiz)
        setValue("ciComplemento", data.ci.complemento)
        setValue("apellidoMaterno", data.apellidoMaterno)
        setValue("apellidoPaterno", data.apellidoPaterno)
        setValue("especialidad", data.especialidad)
      }
    }
  }, [cargar.data])

  const guardar = useMutation((values: Inputs)=>{

    let general: Omit<Empresa, "id" | "estado"> | Omit<Medico, "id" | "estado" | "nombreCompleto">
    if(values.tipo == 1) {
      general = {
        tipo: values.tipo!,
        nit: values.nit!,
        ci: {
          raiz: values.ci!,
          complemento: values.ciComplemento!
        },
        apellidoPaterno: values.apellidoPaterno!,
        apellidoMaterno: values.apellidoMaterno!,
        nombre: values.nombre!,
        especialidad: values.especialidad!,
        regionalId: values.regional![0].id
      }
    }
    else {
      general = {
        tipo: values.tipo!,
        nit: values.nit!,
        nombre: values.nombre!,
        regionalId: values.regional![0].id
      }
    }

    let lat, lng
    if(Array.isArray(values.ubicacion)){
      [lat, lng] = values.ubicacion!
    }
    else{
      ({lat, lng} = values.ubicacion!)
    }
    const contacto: InformacionContacto = {
      direccion: values.direccion!,
      ubicacion: {
        latitud: lat,
        longitud: lng
      },
      telefono1: values.telefono1!,
      telefono2: values.telefono2!
    }

    return id ? ProveedoresService.actualizar({
      id, ...general, ...contacto
    }) : ProveedoresService.registrar({
      ...general, ...contacto
    })
  }, {
    onSuccess: ()=>{
      reset({
        tipo: 1,
        initialized: true,
        ciComplemento: null,
        regional: [],
        direccion: "",
        ubicacion: null
      })
      queryClient.invalidateQueries("proveedores");
      if(id) history.push("/clinica/proveedores")
    }
  })

  // Efecto para agregar errores de validocion devueltos por el servidor
  useServerValidation(guardar.error as AxiosError, setError)

  const renderAlert = () => {
    if(cargar.error) {
      const { response } = cargar.error as AxiosError
      return <Alert variant="danger">
        {
          !response ? "Error: no se pudo conectar con el servidor" :
          response.status == 404 ? "El proveedor no existe" : 
          response.data.message
        }
      </Alert>
    }
    if(guardar.error) {
      const { response } = guardar.error as AxiosError
      return <Alert variant="danger">
        {
          response?.data?.message || "Error: no se pudo conectar con el servidor"
        }
      </Alert>
    }
    if(guardar.isSuccess) {
      return <Alert variant="success">
        La operacion se realizó con exito
      </Alert>
    }
    return null
  }

  return <FormProvider {...formMethods}>
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{to: "/clinica/proveedores"}}>Proveedores</Breadcrumb.Item>
      {id ? <Breadcrumb.Item active>{id}</Breadcrumb.Item> : null}
      <Breadcrumb.Item active>{!id ? "Registro" : "Actualización"}</Breadcrumb.Item>
    </Breadcrumb>
    <Form onSubmit={handleSubmit((values)=>{
      guardar.mutate(values)
    })}>
      {renderAlert()}
      <ProveedorFieldset />
      <ContactoFieldset />
      <Button className="mt-3" type="submit">
        {guardar.isLoading ? <Spinner className="mr-2" animation="border" size="sm"/> : null}
        Guardar
      </Button>
    </Form>
  </FormProvider>
}