import { AxiosError } from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { Col, Form, FormProps, Button, Spinner, Modal, Alert, Row } from 'react-bootstrap'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import { Users } from '../services'
import RolesCheckList from './RolesCheckList'


type Inputs = {
  username: string,
  password: string,
  passwordRepeat: string,
  roleIds: number[]
}

export default (props: FormProps & {
  personId: number
}) =>{
  const {id} = useParams<{
    id?: string 
  }>()

  const formMethods = useForm<Inputs>({
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
      passwordRepeat: "",
      roleIds: []
    }
  });

  const { register, reset, handleSubmit, watch, formState: { isValid, errors} } = formMethods

  const saveUser = useMutation(Users.register)

  const [isModalVisible, showModal] = useState(false)

  useEffect(()=>{
    if(saveUser.error){
      showModal(true)
    }
  }, [saveUser.error])

  const renderUserExistsAlert = ()=>{
    console.log((saveUser.error as AxiosError)?.response?.data)
    const {payload} = (saveUser.error as AxiosError)?.response?.data
    return <Modal centered show={isModalVisible} onHide={()=>showModal(false)}>
      <Modal.Header>Conflicto</Modal.Header>
      <Modal.Body>
        <Alert variant="danger">
          <p>
            Ya existe un <Link to={{
              pathname: `/iam/usuarios/${payload.id}`,
              state: {
                user: payload
              }
            }}>usuario</Link> para esta persona
          </p>
        </Alert>
      </Modal.Body>
    </Modal>
  }

  const renderAlert = ()=>{
    const status = (saveUser.error as AxiosError)?.response?.status
    if(status == 409){
      return renderUserExistsAlert()
    }
    return null
  }

  useEffect(()=>{
    if(saveUser.data){
      reset()
    }
  }, [saveUser.data])

  // const [validated, setValidated] = useState(false)
  return <>
    <FormProvider {...formMethods}>
      <Form noValidate validated={isValid} onSubmit={handleSubmit((data)=>{
        // setValidated(true)
        console.log("OnSubmit", data)
        saveUser.mutate({
          externalId: props.personId,
          username: data.username,
          password: data.password,
          roleIds: data.roleIds
        })
      })}>
        <Form.Row>
          <Form.Group controlId="username" as={Col} md={4}>
            <Form.Label >Usuarios</Form.Label>
            <Form.Control
              isInvalid={!!errors.username}
              {...register("username", {
                pattern: { value: /^\S*$/, message: "Este campo no debe contener espacios."},
                required: {value: true, message: "Este campo es requerido."},
                minLength: {value: 4, message: "Este campo no debe tener al menos 4 caracteres."},
                maxLength: {value: 16, message: "Este campo no debe exceder los 16 caracteres."}
              })}
            ></Form.Control>
            <Form.Control.Feedback type="invalid">{errors.username?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md={4}>
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" 
              isInvalid={!!errors.password}
              {...register("password", {
                required: {value: true, message: "Este campo es requerido"},
                minLength: {value: 8, message: "Este campo no debe tener al menos 8 caracteres"},
                maxLength: {value: 16, message: "Este campo no debe exceder los 16 caracteres"}
              })}
            ></Form.Control>
            <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md={4}>
            <Form.Label>Confirmar contraseña</Form.Label>
            <Form.Control type="password" 
              isInvalid={!!errors.passwordRepeat}
              {...register("passwordRepeat", {
                required: {value: true, message: "Este campo es requerido"},
                validate: {
                  matchPassword: (value) => value === watch('password') || "Las contraseñas no coinciden"
                }
              })}
            ></Form.Control>
            <Form.Control.Feedback type="invalid">{errors.passwordRepeat?.message}</Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <label className="mb-2">Descuentos que se aplicarán</label>
        <Row>
          <Col>
            <RolesCheckList />
          </Col>
        </Row>
        <Form.Row>
          <Col>
            <Button type="submit">
              {saveUser.isLoading ? <Spinner animation="border" size="sm" /> : null}
              <span className="ml-2">Registrar</span>
            </Button>
          </Col>
        </Form.Row>
      </Form>
    </FormProvider>
    {renderAlert()}
  </>
}