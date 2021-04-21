import React from "react"
import { ListGroup, Tab, Col, Row } from "react-bootstrap"
import { useLocation } from "react-router"
import { Link } from "react-router-dom"
import { EspecialidadesIndex } from "../../especialidades/components/EspecialidadesIndex"
import { PrestacionesIndex } from "../../prestaciones/componentes"

export const Settings = () => {
  const {hash} = useLocation()
  console.log(hash)
  return <>
    <h1 style={{fontSize: "2rem"}}>Configuración</h1>
      <Row className="mt-2 flex-nowrap">
        <Tab.Container defaultActiveKey={hash || "#especialidades"} transition={false} >
          <Col className="pr-0" sm={"auto"}>
            <ListGroup>
              <ListGroup.Item as={Link} to={"#especialidades"} eventKey={"#especialidades"}
              >Especialidades</ListGroup.Item>
              <ListGroup.Item as={Link} to={"#prestaciones"} eventKey={"#prestaciones"}
              >Prestaciones</ListGroup.Item>
            </ListGroup>
          </Col>
          <Tab.Content as={Col}>
            <Tab.Pane eventKey={"#especialidades"}>
              <EspecialidadesIndex />
            </Tab.Pane>
            <Tab.Pane eventKey={"#prestaciones"}>
              <PrestacionesIndex />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Row>
  </>
}