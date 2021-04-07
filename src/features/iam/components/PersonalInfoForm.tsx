import { AxiosError } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { Col, Form, Button, FormProps, Spinner, Modal, Alert } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
// import { PersonService } from '../../../commons/services/PersonService'
// import { Person } from '../../../commons/types'
import { validation as validationMessages } from '../../../configs/messages.json'

type Inputs = {
  dni: string,
  dniComplement: string,
  dniIssuedAt: string,
  name: string,
  middlename: string,
  lastname: string,
  gender: string,
  dateOfBirth: string,
  nationality: string
}
export default (props: FormProps & {
  onComplete: (personId: number)=>void
})=>{
  const {
    handleSubmit,
    register,
    reset,
    getValues
  } = useForm<Inputs>({
    // mode: "onBlur",
    defaultValues: {
      dni: "",
      dniComplement: "",
      dniIssuedAt: "",
      name: "",
      middlename: "",
      lastname: "",
      gender: "",
      dateOfBirth: "",
      nationality: ""
    }
  })

  const [errorDialogVisible, showErrorDialog] = useState(false)

  return <>
    <Form onSubmit={handleSubmit((fields)=>{

    })}>
      <Form.Row>
        <Form.Group as={Col} sm={8} md={6}>
          <Form.Label>Documento de identidad</Form.Label>
          <Form.Control type="number"
            name="dni"
          ></Form.Control>
        </Form.Group>
        <Form.Group as={Col} sm={4} md={3}>
          <Form.Label>Complemento</Form.Label>
          <Form.Control
            name="dniComplement"
          ></Form.Control>
        </Form.Group>
        <Form.Group as={Col} sm={4} md={3}>
          <Form.Label>Expedido en</Form.Label>
          <Form.Control as="select"
            name="dniIssuedAt"
          >
            <option disabled value=""></option>
            <option value="BN">Beni</option>
            <option value="CB">Cochabamba</option>
            <option value="CH">Chuquisaca</option>
            <option value="LP">La Paz</option>
            <option value="OR">Oruro</option>
            <option value="PN">Pando</option>
            <option value="PT">Potosí</option>
            <option value="TJ">Tarija</option>
            <option value="SC">Santa Cruz</option>
          </Form.Control>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} lg={4}>
          <Form.Label>Nombres</Form.Label>
          <Form.Control 
            name="name"
          />
        </Form.Group>
        <Form.Group as={Col} lg={4}>
          <Form.Label>Primer Apellido</Form.Label>
          <Form.Control 
            name="middlename"            
          />
        </Form.Group>
        <Form.Group as={Col} lg={4}>
          <Form.Label>Segundo Apellido</Form.Label>
          <Form.Control         
            name="lastname"
          />
        </Form.Group>
      </Form.Row>
    </Form>
  </>
}