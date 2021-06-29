import { Button, Col, Form, InputGroup, Modal, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { Redirect, useHistory, useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import moment from 'moment'
import { PlanService } from '../services'

type Inputs = {
  avance: number
  informe: FileList
  observaciones: string
}

const schema = yup.object().shape({
  avance: yup.number().emptyStringTo().required().min(0).max(100),
  informe: yup.mixed(),
  observaciones: yup.string().emptyStringTo(null).nullable().notRequired().max(250)
})

export const AvanceForm = () => {
  const history = useHistory<any>()

  const {
    planId,
    actividadId
  } = useParams<any>()

  const {
    formState,
    handleSubmit,
    register
  } = useForm<Inputs>({
    resolver: yupResolver(schema)
  })

  const formErrors = formState.errors

  const queryClient = useQueryClient()
  const guardar = useMutation((inputs: Inputs) => {
    return PlanService.registrarAvance(planId, actividadId, {
      avance: inputs.avance,
      observaciones: inputs.observaciones,
      informe: inputs.informe[0]
    })
  }, {
    onSuccess: ({data: entry}) => {
      queryClient.setQueryData(["actividades.cargar", planId, actividadId], (oldData: any)=>{
        console.log("Old Data", oldData)
        return {
          ...oldData,
          data: {
            ...oldData.data,
            historial: [
              ...oldData.data.historial,
              entry
            ]
          }
        }
      })
    }
  })

  if(!history.location.state?.actividad){
    return <Redirect to={history.location.pathname.substring(0, history.location.pathname.lastIndexOf('/'))} />
  }

  return <Modal centered show={!!history.location.state?.actividad} onHide={()=>{
    if(history.location.state?.background){
      history.goBack()
    } else {
      history.replace(history.location.pathname.substring(0, history.location.pathname.lastIndexOf('/')))
    }
  }}>
    <Modal.Header>Registro de avance</Modal.Header>
    <Modal.Body>
      <Form id="avance-form" onSubmit={handleSubmit((values)=>{
        console.log(values)
        guardar.mutate(values)
      })}>
        <Form.Row>
          <Form.Group as={Col} sm={6}>
            <Form.Label>Fecha</Form.Label>
            <Form.Control disabled value={moment().format('L')} />
          </Form.Group>
          <Form.Group as={Col} sm={3}>
            <Form.Label>Avance esperado</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                disabled
                value={history.location.state?.actividad?.avanceEsperado} />
              <InputGroup.Append><InputGroup.Text>%</InputGroup.Text></InputGroup.Append>
              <Form.Control.Feedback type="invalid">{formErrors.avance?.message}</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group as={Col} sm={3}>
            <Form.Label>Avance</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                isInvalid={!!formErrors.avance}
                {...register('avance')} />
              <InputGroup.Append><InputGroup.Text>%</InputGroup.Text></InputGroup.Append>
              <Form.Control.Feedback type="invalid">{formErrors.avance?.message}</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Form.Row>
        <Form.Group>
          <Form.File
            label='Informe'
            {...register('informe')} 
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Observaciones</Form.Label>
          <Form.Control as="textarea" {...register('observaciones')} />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button type="submit" form="avance-form">
        {guardar.isLoading ? <Spinner animation="border" className="mr-2" size="sm" /> : null}
        <span className="align-middle">Guardar</span>
      </Button>
    </Modal.Footer>
  </Modal>
}