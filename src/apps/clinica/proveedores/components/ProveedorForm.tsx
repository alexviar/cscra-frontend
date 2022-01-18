import { useRef, useState } from "react"
import { Button, Breadcrumb, Col, Form, Spinner } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useForm, FormProvider } from "react-hook-form"
import { Inputs as ProveedorInputs, ProveedorFieldset } from "./ProveedorFieldset"
import { Inputs as ContactoInputs, ContactoFieldset } from "./ContactoFieldset"
import { Empresa, Medico, InformacionContacto, ProveedoresService } from "../services"

type Inputs = ProveedorInputs & ContactoInputs

export const ProveedorForm = () => {

  const {
    id
  } = useParams<{id?: string}>()

  const formMethods = useForm<Inputs>({
    defaultValues: {
      tipo: id?.startsWith("EMP") ? 2 : 1,
      initialized: !id
    }
  })

  const {
    handleSubmit,
    setValue,
    watch
  } = formMethods

  const initialized = watch("initialized")

  const queryClient = useQueryClient()

  const cargar = useQuery(["proveedores", "obtener", id], () => {
    return ProveedoresService.cargar(parseInt(id!))
  }, {
    enabled: !!id && !initialized,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess({data}){
      setValue("initialized", true)
      setValue("nit", data.nit)
      setValue("nombre", data.nombre)
      setValue("regional", [data.regional!])
      if(data.tipo == 1){
        setValue("ci", data.ci.raiz)
        setValue("ciComplemento", data.ci.complemento)
        setValue("apellidoMaterno", data.apellidoMaterno)
        setValue("apellidoPaterno", data.apellidoPaterno)
        setValue("especialidad", data.especialidad)
      }
    },
    onError(){
      setValue("initialized", true)
    }
  })

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

    return ProveedoresService.registrar({
      ...general, ...contacto
    })
  }, {
    onSuccess: ()=>{
      queryClient.invalidateQueries("proveedores");
    }
  })


  return <FormProvider {...formMethods}>
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{to: "/clinica/proveedores"}}>Proveedores</Breadcrumb.Item>
      {id ? <Breadcrumb.Item active>{id}</Breadcrumb.Item> : null}
      <Breadcrumb.Item active>{!id ? "Registro" : "Actualización"}</Breadcrumb.Item>
    </Breadcrumb>
    <Form onSubmit={handleSubmit((values)=>{
      guardar.mutate(values)
    })}>
      <ProveedorFieldset />
      <ContactoFieldset />
    </Form>
  </FormProvider>
}