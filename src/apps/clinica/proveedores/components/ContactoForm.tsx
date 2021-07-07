import { useState, useEffect } from "react"
import { AxiosError } from "axios"
import { Alert, Button, Col, Form, Spinner } from "react-bootstrap"
import { LatLngExpression } from "leaflet"
import { Controller, useForm } from "react-hook-form"
import { useHistory, useParams } from "react-router-dom"
import { useQuery, useMutation } from "react-query"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { Departamento, DepartamentosTypeahead, Provincia, ProvinciasTypeahead, Municipio, MunicipiosTypeahead, LocationInput } from "../../../../commons/components"
import { Permisos, useLoggedUser } from '../../../../commons/auth'
import { useModal } from '../../../../commons/reusable-modal'
import { Proveedor, ProveedoresService } from "../services"

export type Inputs = {
  departamento?: Departamento[]
  provincia?: Provincia[]
  municipio?: Municipio[]
  direccion?: string,
  ubicacion?: LatLngExpression
  telefono1?: number
  telefono2?: number | null
}

type Props = {
  onSubmit?: (data: Inputs) => void
  onOmit?: () => void
}

const schema = yup.object().shape({
  municipio: yup.array().label("municipio").length(1, "Debe indicar un municipio"),
  direccion: yup.string().label("dirección").trim().required(),
  ubicacion: yup.mixed().label("ubicación").required(),
  telefono1: yup.number().label("telefono 1").typeError("No es un numero válido")
    .emptyStringTo().required(),
  telefono2: yup.number().label("telefono 2")
    .emptyStringToNull()
    .typeError("No es un numero válido").nullable().notRequired()
})

export const ContactoForm = (props: Props) => {
  const params = useParams<{ idProveedor: string }>()
  const { idProveedor: id } = params
  console.log("Proveedores", id)
  const history = useHistory<{
    proveedor?: Proveedor
  }>()

  const loader = useModal("queryLoader")

  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [municipios, setMunicipios] = useState<Municipio[]>([])

  const {
    handleSubmit,
    register,
    control,
    watch,
    setError,
    setValue,
    formState
  } = useForm<Inputs>({
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: {
      departamento: [],
      provincia: [],
      municipio: [],
      ubicacion: [-17.78629, -63.18117]
    }
  })

  const formErrors = formState.errors

  const cargar = useQuery(["proveedor.cargar", id], () => {
    return ProveedoresService.cargar(parseInt(id))
  }, {
    enabled: !!id && !history.location.state?.proveedor,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
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

  const guardar = useMutation((values: Inputs) => {
    let lat, lng
    if (Array.isArray(values.ubicacion)) {
      [lat, lng] = values.ubicacion!
    }
    else {
      ({ lat, lng } = values.ubicacion!)
    }

    return ProveedoresService.actualizarInformacionDeContacto(parseInt(id), {
      municipioId: values.municipio![0].id,
      direccion: values.direccion!,
      ubicacion: {
        latitud: lat,
        longitud: lng
      },
      telefono1: values.telefono1!,
      telefono2: values.telefono2!
    })
  }, {
    onSuccess: ({ data }) => {
      history.replace(`/clinica/proveedores/${data.id}`)
    },
    onError: (error) => {
      if (error?.response?.status == 422) {
        const { errors } = error.response?.data
        Object.keys(errors).forEach((key: any) => {
          let localKey = key
          // if(key == "asegurado.id") localKey = "asegurado.matricula"
          setError(localKey, { type: "serverError", message: errors[key] })
        })
      }
    }
  })

  const proveedor = history.location.state?.proveedor || cargar.data?.data

  useEffect(() => {
    setValue("direccion", proveedor?.direccion || "")
    const { latitud, longitud } = proveedor?.ubicacion || {
      latitud: -17.78629,
      longitud: -63.18117
    }
    setValue("ubicacion", [latitud, longitud])
    setValue("telefono1", proveedor?.telefono1)
    setValue("telefono2", proveedor?.telefono2)
  }, [proveedor])

  useEffect(() => {
    if (proveedor && municipios.length && provincias.length && departamentos.length) {
      const municipio = municipios.find(m => m.id == proveedor?.municipioId)
      const provincia = provincias.find(p => p.id == municipio?.provinciaId)
      const departamento = departamentos.find(d => d.id == provincia?.departamentoId )
      setValue("municipio", municipio ? [municipio] : [])
      setValue("provincia", provincia ? [provincia] : [])
      setValue("departamento", departamento ? [departamento] : [])
    }
  }, [proveedor, departamentos, provincias, municipios])

  useEffect(() => {
    if (cargar.isLoading) {
      loader.open({
        state: "loading"
      })
    }
  }, [cargar.isLoading])

  const renderAlert = () => {
    if (guardar.isSuccess) {
      return <Alert variant="success">
        La operacion se realizó exitosamente
      </Alert>
    }
    if (guardar.isError) {
      const guardarError = guardar.error as AxiosError
      return <Alert variant="danger">
        {guardarError ? guardarError.response?.data?.message || guardarError.message : ""}
      </Alert>
    }
    return null
  }

  return <Form id="proveedor-contacto-form" onSubmit={handleSubmit(props.onSubmit || ((data) => {
    guardar.mutate(data)
  }))}>
    <h1 style={{ fontSize: "1.75rem" }}>Información de contacto</h1>
    {renderAlert()}
    <Form.Row>
      <Form.Group as={Col} sm={4}>
        <Form.Label>Departamento</Form.Label>
        <Controller
          name="departamento"
          control={control}
          render={({ field, fieldState }) => {
            return <DepartamentosTypeahead
              id="contacto-form/departamentos"
              onLoad={(departamentos) => {
                setDepartamentos(departamentos)
              }}
              feedback={fieldState.error?.message}
              isInvalid={!!fieldState.error}
              selected={field.value}
              onChange={(value) => {
                field.onChange(value)
                setValue("provincia", [])
                setValue("municipio", [])
              }}
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
          render={({ field, fieldState }) => {
            return <ProvinciasTypeahead
              id="contacto-form/provincias"
              onLoad={(provincias) => {
                setProvincias(provincias)
              }}
              filterBy={(provincia) => {
                const departamento = watch("departamento")
                return !!departamento!.length && provincia.departamentoId == departamento![0].id
              }}
              feedback={fieldState.error?.message}
              isInvalid={!!fieldState.error}
              selected={field.value}
              onChange={(value) => {
                field.onChange(value)
                setValue("municipio", [])
              }}
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
          render={({ field, fieldState }) => {
            return <MunicipiosTypeahead
              id="contacto-form/municipios"
              onLoad={(municipios) => {
                setMunicipios(municipios)
              }}
              filterBy={(municipio) => {
                const provincia = watch("provincia")!
                return !!provincia.length && municipio.provinciaId == provincia[0].id
              }}
              feedback={fieldState.error?.message}
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
        <Form.Control as="textarea"
          isInvalid={!!formErrors.direccion}
          {...register("direccion")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.direccion?.message}</Form.Control.Feedback>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col}>
        <Form.Label>Ubicación</Form.Label>
        <Controller
          name="ubicacion"
          control={control}
          render={({ field, fieldState }) => {
            return <>
              <LocationInput
                isInvalid={!!fieldState.error}
                center={field.value || [-17.78629, -63.18117]}
                value={field.value!}
                onChange={field.onChange}
              />
              <Form.Control.Feedback type="invalid">{fieldState.error?.message}</Form.Control.Feedback>
            </>
          }}
        />
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} sm={4}>
        <Form.Label>Teléfono 1</Form.Label>
        <Form.Control
          isInvalid={!!formErrors.telefono1}
          {...register("telefono1")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.telefono1?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} sm={4}>
        <Form.Label>Teléfono 2</Form.Label>
        <Form.Control
          isInvalid={!!formErrors.telefono2}
          {...register("telefono2")}
        />
        <Form.Control.Feedback type="invalid">{formErrors.telefono2?.message}</Form.Control.Feedback>
      </Form.Group>
    </Form.Row>
    {!props.onSubmit ? <Button type="submit">
      {guardar.isLoading ? <Spinner className="mr-2" animation="border" size="sm" /> : null}
      <span className="align-middle">Guardar</span>
    </Button> : null}
  </Form>
}