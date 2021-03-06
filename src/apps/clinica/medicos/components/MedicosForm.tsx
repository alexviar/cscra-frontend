import { AxiosError } from 'axios'
import { useEffect, useState, useRef } from 'react'
import { Alert, Button, Col, Form, Spinner } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { Medico, MedicosService } from '../services'
import { useHistory, useParams } from 'react-router'
import { Regional, RegionalesTypeahead } from '../../../../commons/components'
import { Permisos, useLoggedUser } from '../../../../commons/auth'
import { useModal } from '../../../../commons/reusable-modal'
import { Especialidad, EspecialidadesTypeahead } from './EspecialidadesTypeahead'

type Inputs = {
  tipo: string
  ci: string
  ciComplemento: string
  apellidoPaterno: string
  apellidoMaterno: string
  nombres: string
  especialidad: Especialidad[]
  regional: Regional[]
}

const schema = yup.object().shape({
  tipo: yup.number().label("tipo").oneOf([1, 2]),
  ci: yup.number().label("número de carnet").typeError("El ${path} no es un numero valido"),
  ciComplemento: yup.string().label("número complemento").transform(value => value === "" ? null : value).trim()
    .uppercase().nullable().notRequired()
    .length(2)
    .matches(/(?=.*[A-Z])(?=.*[0-9])/, "El complemento del carnet esta conformado por un numero y una letra. (No confundir con el expedido)"),
  apellidoPaterno: yup.string().label("apellido paterno").trim().when("apellidoMaterno", {
    is: (apellidoMaterno: string) => !apellidoMaterno,
    then: yup.string().required("Debe proporcionar al menos un apellido"),
    otherwise: yup.string().nullable().notRequired()
  }),
  apellidoMaterno: yup.string().label("apellido materno").trim().emptyStringToNull().when("apellidoPaterno", {
    is: (apellidoPaterno: string) => !apellidoPaterno,
    then: yup.string().required("Debe proporcionar al menos un apellido"),
    otherwise: yup.string().emptyStringToNull().notRequired()
  }),
  nombres: yup.string().label("nombres").trim().required(),
  especialidad: yup.array().length(1, "Debe indicar una especialidad"),
  regional: yup.array().length(1, "Debe indicar una regional")
}, [["apellidoMaterno", "apellidoPaterno"]])

export const MedicosForm = ()=>{
  const {id} = useParams<{
    id?: string
  }>()

  const history = useHistory<{
    medico?: Medico
    ignoreAuthorization?: boolean
  }>()

  const modal = useModal("queryLoader")

  const loggedUser = useLoggedUser()

  const [regionales, setRegionales] = useState<Regional[]>([])
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([])

  const continueRef = useRef<boolean>(false)

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
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: {
      especialidad: [],
      regional: []
    }
  })

  console.log("Errors", watch())

  const queryClient = useQueryClient()

  const guardar = useMutation((inputs: Inputs)=>{ 
    return id ? MedicosService.actualizar(parseInt(id), 
      parseInt(inputs.tipo),
      {
        raiz: parseInt(inputs.ci),
        complemento: inputs.ciComplemento
      },
      inputs.apellidoPaterno,
      inputs.apellidoMaterno,
      inputs.nombres,
      inputs.especialidad![0].id,
      inputs.regional![0].id
    ) : MedicosService.registrar(
      parseInt(inputs.tipo),
      {
        raiz: parseInt(inputs.ci),
        complemento: inputs.ciComplemento
      },
      inputs.apellidoPaterno,
      inputs.apellidoMaterno,
      inputs.nombres,
      inputs.especialidad![0].id,
      inputs.regional![0].id
    )
  }, {
    onSuccess: ()=>{
      reset()
      queryClient.invalidateQueries("medicos.buscar")
      if(!continueRef.current)
        history.replace("/clinica/medicos", {
          ignoreAuthorization: true
        })
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

  const cargar = useQuery(["medicos.cargar", id], ()=>{
    return MedicosService.load(parseInt(id as string))
  }, {
    enabled: !!id && !history.location.state?.medico,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: () => {
      modal.close()
    },
    onError: (error) => {
      modal.open({
        state: "error",
        error: error
      })
    }
  })

  const medico = cargar.data?.data || history.location.state?.medico

  useEffect(()=>{
    if(medico){
      setValue("tipo", String(medico.tipo))
      setValue("ci", String(medico.ci.raiz))
      setValue("ciComplemento", medico.ci.complemento)
      setValue("apellidoPaterno", medico.apellidoPaterno)
      setValue("apellidoMaterno", medico.apellidoMaterno)
      setValue("nombres", medico.nombres)
    }
  }, [medico])

  useEffect(()=>{
    if(cargar.isFetching){
      modal.open({
        state: "loading"
      })
    }
  }, [cargar.isFetching])

  useEffect(()=>{
    if(medico && regionales.length){
      setValue("regional", regionales.filter(r=>r.id == medico.regionalId))
    }
  }, [medico, regionales])

  useEffect(()=>{
    if(medico && especialidades.length){
      setValue("especialidad", especialidades.filter(r=>r.id == medico.especialidadId))
    }
  }, [medico, especialidades])

  return <Form id="medico-form"
    onSubmit={handleSubmit((inputs)=>{
      guardar.mutate(inputs)
    })}
  >
    <h1 style={{fontSize: "2rem"}}>{id ? "Actualizar" : "Registrar Medico"}</h1>
    {guardar.status == "error" || guardar.status == "success"  ? <Alert variant={guardar.isError ? "danger" : "success"}>
      {guardar.isError ? (guardar.error as AxiosError).response?.data?.message || (guardar.error as AxiosError).message : "Guardado"}
    </Alert> : null}
    <Form.Row>
      <Form.Group as={Col}>
        <Form.Label>Tipo</Form.Label>
        <div>
          <Form.Check inline type="radio" value="1" label="Empleado" {...register("tipo")} />
          <Form.Check inline type="radio" value="2" label="Proveedor" {...register("tipo")} />
        </div>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} md={4} xs={8}>
        <Form.Label>Carnet de identidad</Form.Label>
        <Form.Control
          isInvalid={!!formState.errors.ci}
          {...register("ci")}
        />
        <Form.Control.Feedback type="invalid">{formState.errors.ci?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} md={2} xs={4}>
        <Form.Label>Complemento</Form.Label>
        <Form.Control
          isInvalid={!!formState.errors.ciComplemento}
          {...register("ciComplemento")}
        />
        <Form.Control.Feedback type="invalid">{formState.errors.ciComplemento?.message}</Form.Control.Feedback>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} md={4}>
        <Form.Label>Apellido Paterno</Form.Label>
        <Form.Control
          isInvalid={!!formState.errors.apellidoPaterno}
          {...register("apellidoPaterno")}
        />
        <Form.Control.Feedback type="invalid">{formState.errors.apellidoPaterno?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} md={4}>
        <Form.Label>Apellido Materno</Form.Label>
        <Form.Control
          isInvalid={!!formState.errors.apellidoMaterno}
          {...register("apellidoMaterno")}
        />
        <Form.Control.Feedback type="invalid">{formState.errors.apellidoMaterno?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} md={4}>
        <Form.Label>Nombres</Form.Label>
        <Form.Control
          isInvalid={!!formState.errors.nombres}
          {...register("nombres")}
        />
        <Form.Control.Feedback type="invalid">{formState.errors.nombres?.message}</Form.Control.Feedback>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} md={8}>
        <Form.Label>Especialidad</Form.Label>
        <Controller
          name="especialidad"
          control={control}
          render={({field, fieldState})=>{
            return <>
              <EspecialidadesTypeahead
                id="medicos-form/especialidades-typeahead"
                onLoad={(especialidades)=>setEspecialidades(especialidades)}
                feedback={fieldState.error?.message}
                isInvalid={!!fieldState.error}
                selected={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            </>
          }}
        />
      </Form.Group>
      <Form.Group as={Col} md={4}>
        <Form.Label>Regional</Form.Label>
        <Controller
          name="regional"
          control={control}
          render={({field, fieldState})=>{
            return <>
              <RegionalesTypeahead
                id="medicos-form/regionales-typeahead"
                onLoad={(regionales)=>setRegionales(regionales)}
                filterBy={(regional) => loggedUser?.can(Permisos.REGISTRAR_MEDICOS) || loggedUser?.regionalId == regional.id}
                feedback={fieldState.error?.message}
                className={fieldState.error ? "is-invalid" : ""}
                isInvalid={!!fieldState.error}
                selected={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            </>
          }}
        />
      </Form.Group>
    </Form.Row>
    <div className="m-n1">
      {!id ? <Button 
        className="m-1"
        type="submit"
        onClick={()=>{
          continueRef.current = true
        }}
      >
        {guardar.isLoading && continueRef.current ? <Spinner animation="border" size="sm" />: null}
        Guardar y continuar
      </Button> : null}
      <Button
        className="m-1"
        type="submit"
        onClick={()=>{
          continueRef.current = false
        }}
      >
        {guardar.isLoading && !continueRef.current ? <Spinner animation="border" size="sm" />: null}
        Guardar
      </Button>
      <Button 
        className="m-1"
        variant="secondary"
        type="reset"
        onClick={()=>{
          setValue("regional", [])
          setValue("especialidad", [])
          clearErrors()
        }}
      >Limpiar</Button>
    </div>
  </Form>
}