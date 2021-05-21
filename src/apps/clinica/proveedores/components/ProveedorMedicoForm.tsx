import { AxiosError, AxiosResponse } from 'axios'
import { useEffect, useState, useRef } from 'react'
import { Alert, Button, Col, Form, InputGroup, Modal, Spinner } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { useHistory, useParams } from 'react-router'
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from 'yup'
import { Especialidad, EspecialidadesTypeahead } from '../../medicos/components/EspecialidadesTypeahead'
import { Regional, RegionalesTypeahead } from '../../../../commons/components'
import { Permisos, useLoggedUser } from '../../../../commons/auth'
import { Proveedor, ProveedoresService } from '../services'

export type Inputs = {
  tipo?: 1
  nit?: number
  ci?: number
  ciComplemento?: string
  apellidoPaterno?: string
  apellidoMaterno?: string
  nombres?: string
  especialidad?: Especialidad[]
  regional?: Regional[]
}

type Props = {
  proveedor?: Proveedor,
  onSubmit?: (data: Inputs) => void
}

const schema = yup.object().shape({
  nit: yup.number().label("NIT")
    .emptyStringToNull()
    .typeError("El ${path} no es un numero valido")
    .nullable()
    .notRequired(),
  ci: yup.number().label("número de carnet")
    .emptyStringToNull()
    .typeError("El ${path} no es un numero valido")
    .nullable()
    .required(),
  ciComplemento: yup.string().transform(value => value === "" ? null : value).trim().uppercase().nullable().notRequired()
    .length(2).matches(/[0-1A-Z]/),
  apellidoPaterno: yup.string().label("apellido paterno").trim().when("apellidoMaterno", {
    is: (apellidoMaterno: string) => !apellidoMaterno,
    then: yup.string().required("Debe proporcionar al menos un apellido").max(50)
  }),
  apellidoMaterno: yup.string().label("apellido materno").trim().when("apellidoPaterno", {
    is: (apellidoPaterno: string) => !apellidoPaterno,
    then: yup.string().required("Debe proporcionar al menos un apellido").max(50)
  }),
  nombres: yup.string().label("nombres").trim().required().label("'Nombres'").max(50),
  especialidad: yup.array().length(1, "Debe indicar una especialidad"),
  regional: yup.array().length(1, "Debe indicar una regional")
}, [["apellidoMaterno", "apellidoPaterno"]])


export const ProveedorMedicoForm = ({proveedor, onSubmit}: Props)=>{
  const {id} = useParams<{
    id?: string
  }>()

  const history = useHistory()

  const loggedUser = useLoggedUser()

  const [especialidades, setEspecialidades] = useState<Especialidad[]>([])
  const [regionales, setRegionales] = useState<Regional[]>([])

  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState,
    watch
  } = useForm<Inputs>({
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: {
      tipo: 1,
      nit: proveedor?.nit as number,
      ci: proveedor?.medico?.ci?.raiz,
      ciComplemento: proveedor?.medico?.ci.complemento,
      apellidoPaterno: proveedor?.medico?.apellidoPaterno||"",
      apellidoMaterno: proveedor?.medico?.apellidoMaterno||"",
      nombres: proveedor?.medico?.nombres||"",
      especialidad: [],
      regional: [],
    }
  })

  const formErrors = formState.errors

  const guardar = useMutation((inputs: Inputs)=>{
    return ProveedoresService.actualizar(parseInt(id!), {
      tipoId: 1,
      nit: inputs.nit,
      ci: inputs.ci!,
      ciComplemento: inputs.ciComplemento,
      apellidoPaterno: inputs.apellidoPaterno,
      apellidoMaterno: inputs.apellidoMaterno,
      nombres: inputs.nombres!,
      especialidadId: inputs.especialidad![0].id,
      regionalId: inputs.regional![0].id
    })
  }, {
    onSuccess: ({data})=>{
      history.replace(`/clinica/proveedores/${data.id}`)
    }
  })

  useEffect(()=>{
    if(proveedor && especialidades.length){
      setValue("especialidad", especialidades.filter(r=>r.id == proveedor.medico?.especialidadId))
    }
  }, [proveedor, especialidades])

  useEffect(()=>{
    if(proveedor && regionales.length){
      setValue("regional", regionales.filter(r=>r.id == proveedor.regionalId))
    }
  }, [proveedor, regionales])

  console.log("Errors", formErrors, watch())

  return <>
    <Form id="proveedor-form"
      onSubmit={handleSubmit(onSubmit || ((inputs)=>{
        guardar.mutate(inputs)
      }))}
    >
      {guardar.status == "error" || guardar.status == "success"  ? <Alert variant={guardar.isError ? "danger" : "success"}>
        {guardar.isError ? (guardar.error as AxiosError).response?.data?.message || (guardar.error as AxiosError).message : "Guardado"}
      </Alert> : null}
      <Form.Row>
        <Form.Group as={Col} md={4} xs={8}>
          <Form.Label>NIT</Form.Label>
          <Form.Control
            isInvalid={!!formErrors.nit}
            {...register("nit")}
          />
          <Form.Control.Feedback type="invalid">{formErrors.nit?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md={4} xs={8}>
          <Form.Label>Carnet de identidad</Form.Label>
          <Form.Control
            isInvalid={!!formErrors.ci}
            {...register("ci")}
          />
          <Form.Control.Feedback type="invalid">{formErrors.ci?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md={2} xs={4}>
          <Form.Label>Complemento</Form.Label>
          <Form.Control
            isInvalid={!!formErrors.ciComplemento}
            {...register("ciComplemento")}
          />
          <Form.Control.Feedback type="invalid">{formErrors.ciComplemento?.message}</Form.Control.Feedback>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md={4}>
          <Form.Label>Apellido Paterno</Form.Label>
          <Form.Control
            isInvalid={!!formErrors.apellidoPaterno}
            {...register("apellidoPaterno")}
          />
          <Form.Control.Feedback type="invalid">{formErrors.apellidoPaterno?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>Apellido Materno</Form.Label>
          <Form.Control
            isInvalid={!!formErrors.apellidoMaterno}
            {...register("apellidoMaterno")}
          />
          <Form.Control.Feedback type="invalid">{formErrors.apellidoMaterno?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>Nombres</Form.Label>
          <Form.Control
            isInvalid={!!formErrors.nombres}
            {...register("nombres")}
          />
          <Form.Control.Feedback type="invalid">{formErrors.nombres?.message}</Form.Control.Feedback>
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
                  align="left"
                  onLoad={(especialidades)=>setEspecialidades(especialidades)}
                  feedback={fieldState.error?.message}
                  className={formState.errors.especialidad ? "is-invalid" : ""}
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
                  id="proveedor-form/regionales-typeahead"
                  onLoad={(regionales)=>setRegionales(regionales)}
                  filterBy={(regional) => {
                    if(loggedUser.can(Permisos.REGISTRAR_PROVEEDORES)) return true 
                    if(loggedUser.can(Permisos.REGISTRAR_PROVEEDORES_REGIONAL) && loggedUser.regionalId == regional.id) return true
                    if(id && loggedUser.can(Permisos.EDITAR_PROVEEDORES)) return true
                    if(id && loggedUser.can(Permisos.EDITAR_PROVEEDORES_REGIONAL) && loggedUser.regionalId == regional.id) return true
                    return false
                  }}
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
      </Form.Row>
      {!onSubmit ? <Button
        type="submit"
      >
        {guardar.isLoading ? <Spinner animation="border" size="sm" />: null}
        Guardar
      </Button> : null}
    </Form>
  </>
}