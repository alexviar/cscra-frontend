import { Button, Col, Form, InputGroup, Modal, ModalProps, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useHistory, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import moment from 'moment'
import { useRegistrarAvance } from '../queries'
import { Actividad, PlanService } from '../services'

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

type Props = {
  actividad: Actividad
} & ModalProps


export const AvanceForm = ({actividad, ...modalProps}: Props ) => {

  const params = useParams<any>()
  const planId = parseInt(params.planId)

  const {
    formState,
    handleSubmit,
    register,
    reset
  } = useForm<Inputs>({
    resolver: yupResolver(schema)
  })

  const formErrors = formState.errors

  const guardar = useRegistrarAvance({
    onSuccess: () => {
      reset()
      modalProps.onHide && modalProps.onHide()
    }
  })
  
  return <Modal centered {...modalProps} >
    <Modal.Header>Registro de avance</Modal.Header>
    <Modal.Body>
      <Form id="avance-form" onSubmit={handleSubmit((values)=>{
        guardar.mutate({
          params: {
            planId,
            actividadId: actividad.id
          },
          data: {
            avance: values.avance,
            observaciones: values.observaciones,
            informe: values.informe[0]
          }
        })
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
                value={actividad.avanceEsperado} />
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