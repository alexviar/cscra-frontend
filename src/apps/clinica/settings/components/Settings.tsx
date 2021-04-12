import React from "react"
import { ListGroup, Tab, Col, Row } from "react-bootstrap"
import { useLocation } from "react-router"
import { EspecialidadesIndex } from "../../especialidades/components/EspecialidadesIndex"

export const Settings = () => {
  const {hash} = useLocation()
  return <>
    <h1 style={{fontSize: "2rem"}}>Configuración</h1>
      <Row className="mt-2 flex-nowrap">
        <Tab.Container defaultActiveKey={hash || "#especialidades"} transition={false} >
          <Col className="pr-0" sm={"auto"}>
            <ListGroup>
              <ListGroup.Item eventKey={"#especialidades"}
              >Especialidades</ListGroup.Item>
              <ListGroup.Item eventKey={"#prestaciones"}
              >Prestaciones</ListGroup.Item>
            </ListGroup>
          </Col>
          <Tab.Content as={Col}>
            <Tab.Pane eventKey={"#especialidades"}>
              <EspecialidadesIndex />
            </Tab.Pane>
            <Tab.Pane eventKey={"#prestaciones"}></Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Row>
  </>
}