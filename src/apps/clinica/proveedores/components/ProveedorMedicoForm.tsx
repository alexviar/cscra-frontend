import { AxiosError, AxiosResponse } from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { Alert, Button, Col, Form, InputGroup, Modal, Spinner } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { FaSearch } from 'react-icons/fa'
import { useMutation, useQuery } from 'react-query'
import * as rules from '../../../../commons/components/rules'
import { Proveedor, ProveedoresService } from '../services'
import { Especialidad } from '../../especialidades/services'
import { useHistory, useParams } from 'react-router'
import { Regional } from '../../../../commons/services/RegionalesService'
import { RegionalesTypeahead } from '../../../../commons/components'
import { EspecialidadesTypeahead } from '../../medicos/components/EspecialidadesTypeahead'

type Inputs = {
  nit: string
  ci: string
  ciComplemento: string
  apellidoPaterno: string
  apellidoMaterno: string
  nombres: string
  especialidad: Especialidad[]
  regional: Regional[]
}

type Props = {
  proveedor?: Proveedor,
  noRedirect?: boolean,
  next?: () => void
}

export const ProveedorMedicoForm = ({proveedor, noRedirect=false, next}: Props)=>{
  const [regionales, setRegionales] = useState<Regional[]>([])
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([])
  const {id} = useParams<{
    id?: string
  }>()
  const history = useHistory()

  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState,
  } = useForm<Inputs>({
    mode: "onBlur",
    defaultValues: {
      nit: proveedor?.nit?.toString() || "",
      ci: proveedor?.medico?.ci?.raiz.toString() || "",
      ciComplemento: proveedor?.medico?.ci.complemento || "",
      apellidoPaterno: proveedor?.medico?.apellidoPaterno || "",
      apellidoMaterno: proveedor?.medico?.apellidoMaterno || "",
      nombres: proveedor?.medico?.nombres,
      especialidad: [],
      regional: []
    }
  })

  const guardar = useMutation((inputs: Inputs)=>{
    return id ? ProveedoresService.actualizar(parseInt(id), {
      tipoId: 1,
      nit: parseInt(inputs.nit),
      ci: inputs.ci,
      ciComplemento: inputs.ciComplemento,
      apellidoPaterno: inputs.apellidoPaterno,
      apellidoMaterno: inputs.apellidoMaterno,
      nombres: inputs.nombres,
      especialidadId: inputs.especialidad![0].id,
      regionalId: inputs.regional![0].id
    }) : ProveedoresService.registrar({
      tipoId: 1,
      nit: parseInt(inputs.nit),
      ci: inputs.ci,
      ciComplemento: inputs.ciComplemento,
      apellidoPaterno: inputs.apellidoPaterno,
      apellidoMaterno: inputs.apellidoMaterno,
      nombres: inputs.nombres,
      especialidadId: inputs.especialidad![0].id,
      regionalId: inputs.regional![0].id
    })
  })

  useEffect(()=>{
    if(proveedor && regionales.length){
      setValue("regional", regionales.filter(r=>r.id == proveedor.regionalId))
    }
  }, [proveedor, regionales])

  useEffect(()=>{
    if(proveedor && especialidades.length){
      setValue("especialidad", especialidades.filter(r=>r.id == proveedor.medico?.especialidadId))
    }
  }, [proveedor, especialidades])

  useEffect(()=>{
    if(guardar.data){
      if(next){
        history.replace(history.location.pathname, {
          proveedor: guardar.data.data
        })
        next()
      }
      else{
        history.replace(`/clinica/proveedores/${guardar.data.data.id}`)
      }
    }
  }, [guardar.data])

  return <>
    <Form id="prestacion-form"
      onSubmit={handleSubmit((inputs)=>{
        guardar.mutate(inputs)
      })}
    >
      {guardar.status == "error" || guardar.status == "success"  ? <Alert variant={guardar.isError ? "danger" : "success"}>
        {guardar.isError ? (guardar.error as AxiosError).response?.data?.message || (guardar.error as AxiosError).message : "Guardado"}
      </Alert> : null}
      <Form.Row>
        <Form.Group as={Col} md={4} xs={8}>
          <Form.Label>NIT</Form.Label>
          <Form.Control
            isInvalid={!!formState.errors.nit}
            {...register("nit")}
          />
          <Form.Control.Feedback type="invalid">{formState.errors.ci?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md={4} xs={8}>
          <Form.Label>Carnet de identidad</Form.Label>
          <Form.Control
            isInvalid={!!formState.errors.ci}
            {...register("ci", {
              required: rules.required()
            })}
          />
          <Form.Control.Feedback type="invalid">{formState.errors.ci?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md={2} xs={4}>
          <Form.Label>Complemento</Form.Label>
          <Form.Control
            isInvalid={!!formState.errors.ciComplemento}
            {...register("ciComplemento", {
              maxLength: rules.maxLength(2)
            })}
          />
          <Form.Control.Feedback type="invalid">{formState.errors.ciComplemento?.message}</Form.Control.Feedback>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md={4}>
          <Form.Label>Apellido Paterno</Form.Label>
          <Form.Control
            isInvalid={!!formState.errors.apellidoPaterno}
            {...register("apellidoPaterno", {
              // validate: {
              //   required: (value)=>{
              //     const apellidoMaterno = watch("apellidoMaterno")
              //     if(!apellidoMaterno && !value){
              //       return "Debe indicar al menos un apellido"
              //     }
              //   }
              // }
            })}
          />
          <Form.Control.Feedback type="invalid">{formState.errors.apellidoPaterno?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>Apellido Materno</Form.Label>
          <Form.Control
            isInvalid={!!formState.errors.apellidoMaterno}
            {...register("apellidoMaterno", {
              // validate: {
              //   required: (value)=>{
              //     const apellidoPaterno = watch("apellidoPaterno")
              //     if(!apellidoPaterno && !value){
              //       return "Debe indicar al menos un apellido"
              //     }
              //   }
              // }
              required: rules.required(),
              maxLength: rules.maxLength(20)
            })}
          />
          <Form.Control.Feedback type="invalid">{formState.errors.apellidoMaterno?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>Nombres</Form.Label>
          <Form.Control
            isInvalid={!!formState.errors.nombres}
            {...register("nombres", {
              required: rules.required(),
              maxLength: rules.maxLength(40)
            })}
          />
          <Form.Control.Feedback type="invalid">{formState.errors.nombres?.message}</Form.Control.Feedback>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md={4}>
          <Form.Label>Especialidad</Form.Label>
          <Controller
            name="especialidad"
            control={control}
            rules={{
              required: rules.required()
            }}
            render={({field, fieldState})=>{
              return <>
                <EspecialidadesTypeahead
                  id="medicos-form/especialidades-typeahead"
                  onLoad={(especialidades)=>setEspecialidades(especialidades)}
                  className={formState.errors.especialidad ? "is-invalid" : ""}
                  isInvalid={!!fieldState.error}
                  selected={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
                <Form.Control.Feedback type="invalid">{fieldState.error?.message}</Form.Control.Feedback>
              </>
            }}
          />
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>Regional</Form.Label>
          <Controller
            name="regional"
            control={control}
            rules={{
              required: rules.required()
            }}
            render={({field, fieldState})=>{
              return <>
                <RegionalesTypeahead
                  id="medicos-form/regionales-typeahead"
                  onLoad={(regionales)=>setRegionales(regionales)}
                  className={fieldState.error ? "is-invalid" : ""}
                  isInvalid={!!fieldState.error}
                  selected={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
                <Form.Control.Feedback type="invalid">{fieldState.error?.message}</Form.Control.Feedback>
              </>
            }}
          />
        </Form.Group>
      </Form.Row>
      <Button
        type="submit"
        form="prestacion-form"
      >
        {guardar.isLoading ? <Spinner animation="border" size="sm" />: null}
        Guardar
      </Button>
    </Form>
  </>
}