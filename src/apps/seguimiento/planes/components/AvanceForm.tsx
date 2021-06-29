import { Col, Form, Modal } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

type Inputs = {
  avance: number
  informe: FileList
  observaciones: string
}

export const AvanceForm = () => {
  const history = useHistory<any>()

  const {
    handleSubmit,
    register
  } = useForm<Inputs>()

  const background = history.location.state.background || history.location.pathname.substring(0, history.location.pathname.lastIndexOf('/'))

  return <Modal centered show={true} onHide={()=>{
    history.replace(background)
  }}>
    <Modal.Header>Registro de avance</Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Fecha</Form.Label>
            <Form.Control readOnly value={moment().format('L')} />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Avance esperado</Form.Label>
            <Form.Control readOnly value={''} />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Avance</Form.Label>
            <Form.Control {...register('avance')} />
          </Form.Group>
        </Form.Row>
        <Form.Group>
          <Form.File
            label='Informe'
            {...register('avance')} 
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Observaciones</Form.Label>
          <Form.Control as="textarea" {...register('avance')} />
        </Form.Group>
      </Form>
    </Modal.Body>
  </Modal>
}