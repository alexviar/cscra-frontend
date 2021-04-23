import { AxiosError, AxiosResponse } from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { Alert, Button, Col, Form, Modal, Spinner } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { FaSearch } from 'react-icons/fa'
import { useMutation, useQuery } from 'react-query'
import * as rules from '../../../../commons/components/rules'
import { Medico, MedicosService } from '../services'
import { Especialidad } from '../../especialidades/services'
import { Redirect, useHistory, useParams } from 'react-router'
import { Regional } from '../../../../commons/services/RegionalesService'
import { RegionalesTypeahead } from '../../../../commons/components/RegionalesTypeahead'
import { EspecialidadesTypeahead } from './EspecialidadesTypeahead'

type Inputs = {
  ci: string
  ciComplemento: string
  apellidoPaterno: string
  apellidoMaterno: string
  nombres: string
  especialidad: Especialidad[]
  regional: Regional[]
}
export default ()=>{
  const {id} = useParams<{
    id?: string
  }>()

  const history = useHistory<{
    medico: Medico
  }>()

  const [regionales, setRegionales] = useState<Regional[]>([])
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([])

  const continueRef = useRef<boolean>(false)

  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState,
  } = useForm<Inputs>({
    defaultValues: {
      especialidad: [],
      regional: []
    }
  })

  const guardar = useMutation((inputs: Inputs)=>{
    return id ? MedicosService.actualizar(parseInt(id), {
        raiz: parseInt(inputs.ci),
        complemento: inputs.ciComplemento
      },
      inputs.apellidoPaterno,
      inputs.apellidoMaterno,
      inputs.nombres,
      inputs.especialidad![0].id,
      inputs.regional![0].id
    ) : MedicosService.registrar({
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
      if(!continueRef.current)
        history.goBack()
    }
  })

  const load = useQuery(["loadMedico", id], ()=>{
    return MedicosService.load(parseInt(id as string))
  }, {
    enabled: !!id && !history.location.state?.medico,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const medico = load.data?.data || history.location.state?.medico

  useEffect(()=>{
    if(medico){
      setValue("ci", String(medico.ci.raiz))
      setValue("ciComplemento", medico.ci.complemento)
      setValue("apellidoPaterno", medico.apellidoPaterno)
      setValue("apellidoMaterno", medico.apellidoMaterno)
      setValue("nombres", medico.nombres)
      // setValue("especialidad",[{id: medico.especialidadId, nombre: medico.especialidad}])
      // setValue("regional", [{id: medico.regionalId}])
    }
  }, [medico])

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

  if(guardar.status == "success" && !continueRef.current){
    <Redirect to="/clinica/medicos"/>
  }

  // if(load.isFetching){
  //   return <Spinner animation="border">Cargando</Spinner>
  // }
  // const error = load.error as AxiosError
  // if(error){
  //   return <Alert variant="danger">
  //     {error.response?.data?.message || error.message}
  //   </Alert>
  // }
  return <>
    <Form id="prestacion-form"
      onSubmit={handleSubmit((inputs)=>{
        guardar.mutate(inputs)
      })}
    >
      <h1 style={{fontSize: "2rem"}}>{id ? "Actualizar" : "Registrar Medico"}</h1>
      {guardar.status == "error" || guardar.status == "success"  ? <Alert variant={guardar.isError ? "danger" : "success"}>
        {guardar.isError ? (guardar.error as AxiosError).response?.data?.message || (guardar.error as AxiosError).message : "Guardado"}
      </Alert> : null}
      <Form.Row>
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
            isInvalid={!!formState.errors.ci}
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
            isInvalid={!!formState.errors.ci}
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
            isInvalid={!!formState.errors.ci}
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
            isInvalid={!!formState.errors.ci}
            {...register("nombres", {
              maxLength: rules.maxLength(40)
            })}
          />
          <Form.Control.Feedback type="invalid">{formState.errors.nombres?.message}</Form.Control.Feedback>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md={4}>
          <Form.Label>Apellido Materno</Form.Label>
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
      <div className="m-n1">
        {!id ? <Button 
          className="m-1"
          type="submit"
          form="prestacion-form"
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
          form="prestacion-form"
          onClick={()=>{
            continueRef.current = false
          }}
        >
          {guardar.isLoading && !continueRef.current ? <Spinner animation="border" size="sm" />: null}
          Guardar
        </Button>
      </div>
    </Form>
    <Modal show={load.isFetching || load.isError} centered >
      <Modal.Body>
        {load.isFetching ? 
          <><Spinner animation="border"/>Cargando</> : 
          load.isError ? <Alert variant="danger">
               {(load.error as AxiosError).response?.data?.message || (load.error as AxiosError).message}
          </Alert> : null}
      </Modal.Body>
    </Modal>
  </>
}