import React, {useState} from 'react'
import { Accordion, Button, Card, Col, Form } from 'react-bootstrap'
import { useMutation } from 'react-query'
import { useDispatch } from 'react-redux'
import { registerUser } from '../actions'
import PersonalInfoForm from './PersonalInfoForm'
import UserInfoForm from './UserInfoForm'

export default () => {
  const dispatch = useDispatch()
  const [activeKey, setActiveKey] = useState("0")
  const [personId, setPersonId] = useState<number | null>(null)
  
  // const {

  // } = useMutation(UserService.register)

  return <div className="d-flex flex-column bg-white rounded-lg shadow-sm m-2 p-3 flex-grow-1">
    <h1 style={{fontSize: "2rem"}}>Usuarios</h1>
    <Accordion defaultActiveKey={activeKey}>
      <Card>
        <Accordion.Toggle as={Card.Header} className="bg-primary text-light" eventKey="0">
          Información personal
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <PersonalInfoForm onComplete={(personId)=>{
              setPersonId(personId)
            }} />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card>
        <Accordion.Toggle as={Card.Header} className="bg-primary text-light" eventKey="1">
          Información de Usuario
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="1">
          <Card.Body>
            <UserInfoForm personId={personId as number} />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  </div>
}