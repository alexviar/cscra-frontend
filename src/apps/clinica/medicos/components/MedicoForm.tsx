
import { useEffect } from 'react'
import { AxiosError } from 'axios'
import { Alert, Breadcrumb, Button, Col, Form, Spinner } from 'react-bootstrap'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link, useHistory, useParams } from "react-router-dom"
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { Medico, MedicosService } from '../services'
import { Regional, RegionalesTypeahead } from '../../../../commons/components'
import { medicoPolicy } from '../policies'
import { useUser } from '../../../../commons/auth'

type Inputs = {
  initialized: boolean
  ci: string
  ciComplemento: string | null
  apellidoPaterno: string
  apellidoMaterno: string
  nombres: string
  especialidad: string
  regional: Regional[]
}

const schema = yup.object().shape({
  ci: yup.number().label("número de carnet")
    .nonEmpty()
    .typeError("El ${path} no es un numero valido")
    .required(),
  ciComplemento: yup.string().label("complemento del carnet").nonEmpty().uppercase().default(null).nullable()
    .notRequired()
    .matches(/^[1-9][A-Z]$/, "Complemento invalido."),
    // .matches(/(?=.*[A-Z])(?=.*[0-9])/, "El complemento del carnet esta conformado por un numero y una letra. (No confundir con el expedido)"),
  apellidoPaterno: yup.string().label("apellido paterno").nonEmpty().uppercase().default(null).nullable()
    .when("apellidoMaterno", {
      is: (apellidoMaterno: string) => !apellidoMaterno,
      then: (schema) => schema.required("Debe proporcionar al menos un apellido").max(25)
    }),
  apellidoMaterno: yup.string().trim().label("apellido materno").nonEmpty().uppercase().default(null).nullable()
  .when("apellidoPaterno", {
    is: (apellidoPaterno: string) => !apellidoPaterno,
    then: (schema) => schema.required("Debe proporcionar al menos un apellido").max(25)
  }),
  nombres: yup.string().label("nombres").nonEmpty().uppercase().trim().required(),
  especialidad: yup.string().nonEmpty().uppercase().required("Debe indicar la especialidad del médico"),
  regional: yup.array().length(1, "Debe indicar una regional")
}, [["apellidoMaterno", "apellidoPaterno"]])

export const MedicoForm = ()=>{
  const {id} = useParams<{
    id?: string
  }>()

  const history = useHistory<{
    medico?: Medico
  }>()

  const user = useUser()

  const {
    handleSubmit,
    register,
    clearErrors,
    setError,
    setValue,
    reset,
    watch,
    control,
    formState,
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      initialized: !id,
      regional: []
    }
  })

  const initialized = watch("initialized")

  const queryClient = useQueryClient()
  
  const cargar = useQuery(["medicos", "cargar", id], ()=>{
    return MedicosService.load(parseInt(id as string))
  }, {
    enabled: !!id && !initialized,
    initialData: history.location.state?.medico && {status: 200, statusText: "OK", data: history.location.state.medico, headers: {}, config: {}},
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const guardar = useMutation((inputs: Inputs)=>{
    return id ? MedicosService.actualizar({
      id: parseInt(id),
      ci: {
        raiz: parseInt(inputs.ci),
        complemento: inputs.ciComplemento
      },
      apellidoPaterno: inputs.apellidoPaterno,
      apellidoMaterno: inputs.apellidoMaterno,
      nombres: inputs.nombres,
      especialidad: inputs.especialidad,
      regionalId: inputs.regional![0].id
    }) : MedicosService.registrar({
      ci: {
        raiz: parseInt(inputs.ci),
        complemento: inputs.ciComplemento
      },
      apellidoPaterno: inputs.apellidoPaterno,
      apellidoMaterno: inputs.apellidoMaterno,
      nombres: inputs.nombres,
      especialidad: inputs.especialidad,
      regionalId: inputs.regional![0].id
    })
  }, {
    onSuccess: (response)=>{
      reset()
      queryClient.invalidateQueries(["medicos", "buscar"])
      if(id) queryClient.setQueryData(["medicos", "cargar", id], response)
    },
    onError: (error) => {
      if((error as AxiosError)?.response?.status == 422){
        const {errors} = (error as AxiosError).response?.data
        Object.keys(errors).forEach((key: any)=>{
          let localKey = key
          setError(localKey, {type: "serverError", message: errors[key]})
        })
      }
    }
  })

  const medico = cargar.data?.data

  useEffect(()=>{
    if(medico){
      setValue("initialized", true)
      setValue("ci", String(medico.ci.raiz))
      setValue("ciComplemento", medico.ci.complemento)
      setValue("apellidoPaterno", medico.apellidoPaterno)
      setValue("apellidoMaterno", medico.apellidoMaterno)
      setValue("nombres", medico.nombres)
      setValue("especialidad", medico.especialidad)
      setValue("regional", [ medico.regional! ])
    }
  }, [medico])

  return <div>
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{to: "/clinica/medicos"}}>Médicos</Breadcrumb.Item>
      {id ? <Breadcrumb.Item active>{id}</Breadcrumb.Item> : null}
      <Breadcrumb.Item active>{!id ? "Registro" : "Actualización"}</Breadcrumb.Item>
    </Breadcrumb>
      
    <Form id="medico-form"
      onSubmit={handleSubmit((inputs)=>{
        guardar.mutate(inputs)
      })}
    >
      {guardar.status == "error" || guardar.status == "success"  ? <Alert variant={guardar.isError ? "danger" : "success"}>
        {guardar.isError ? (guardar.error as AxiosError).response?.data?.message || (guardar.error as AxiosError).message : "Guardado"}
      </Alert> : null}
      <Form.Row>
        <Form.Group as={Col} xs={12} sm={6} md={4}>
          <fieldset className={`border${formState.errors.ci || formState.errors.ciComplemento ? " border-danger " : " "}rounded`}
            style={{padding: 5, paddingTop: 0, marginBottom: -6, marginLeft: -5, marginRight: -5}}>
            <Form.Label as="legend" style={{width: "auto", fontSize:"1rem"}}>Carnet de identidad</Form.Label>
            <Form.Row>
              <Col xs={8}>
                {initialized ? <Form.Control
                  aria-label="Número raiz"
                  className="text-uppercase"
                  isInvalid={!!formState.errors.ci}
                  {...register("ci")}
                /> : <Skeleton />}
                <Form.Control.Feedback type="invalid">{formState.errors.ci?.message}</Form.Control.Feedback>
              </Col>
              <Col xs={4}>
                {initialized ? <Form.Control
                  aria-label="Número complemento"
                  className="text-uppercase"
                  isInvalid={!!formState.errors.ciComplemento}
                  {...register("ciComplemento")}
                /> : <Skeleton />}
                <Form.Control.Feedback type="invalid">{formState.errors.ciComplemento?.message}</Form.Control.Feedback>
              </Col>
            </Form.Row>
          </fieldset>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md={4}>
          <Form.Label>Apellido Paterno</Form.Label>
          {initialized ? <Form.Control
            className="text-uppercase"
            isInvalid={!!formState.errors.apellidoPaterno}
            {...register("apellidoPaterno")}
          /> : <Skeleton />}
          <Form.Control.Feedback type="invalid">{formState.errors.apellidoPaterno?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>Apellido Materno</Form.Label>
          {initialized ? <Form.Control
            className="text-uppercase"
            isInvalid={!!formState.errors.apellidoMaterno}
            {...register("apellidoMaterno")}
          /> : <Skeleton />}
          <Form.Control.Feedback type="invalid">{formState.errors.apellidoMaterno?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>Nombres</Form.Label>
          {initialized ? <Form.Control
            className="text-uppercase"
            isInvalid={!!formState.errors.nombres}
            {...register("nombres")}
          /> : <Skeleton />}
          <Form.Control.Feedback type="invalid">{formState.errors.nombres?.message}</Form.Control.Feedback>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md={4}>
          <Form.Label htmlFor="medico-especialidad">Especialidad</Form.Label>
          {initialized ? <Form.Control
            id="medico-especialidad"
            className="text-uppercase"
            isInvalid={!!formState.errors.especialidad}
            {...register("especialidad")}
          /> : <Skeleton />}
          <Form.Control.Feedback type="invalid">{formState.errors.especialidad?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>Regional</Form.Label>
          {initialized ? <Controller
            name="regional"
            control={control}
            render={({field, fieldState})=>{
              return <>
                <RegionalesTypeahead
                  id="medicos-form/regionales-typeahead"
                  className="text-uppercase"
                  filterBy={(regional) => {
                    if(id){
                      return medicoPolicy.editByRegionalOnly(user, {regionalId: regional.id}) !== false
                    }
                    else {
                      return medicoPolicy.registerByRegionalOnly(user, {regionalId: regional.id}) !== false
                    }
                  }}
                  feedback={fieldState.error?.message}
                  isInvalid={!!fieldState.error}
                  selected={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </>
            }}
          /> : <Skeleton />}
        </Form.Group>
      </Form.Row>
      <Button className="mt-3" type="submit">
          {guardar.isLoading ? <Spinner className="mr-2" animation="border" size="sm"/> : null}
          Guardar
        </Button>
    </Form>
  </div>
}