import React from "react"
import { Form, Button, Col } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { FaSearch } from "react-icons/fa"

type Props = {
  onSearch: (nombre: string) => void 
}
export const PrestacionesFilterForm = (props: Props) =>{
  const { register, handleSubmit } = useForm<{nombre: string}>()
  return <Form onSubmit={handleSubmit(({nombre})=>{
    props.onSearch(nombre?.trim())
  })} >
    <Form.Row className="flex-nowrap">
      <Col>
        <Form.Label htmlFor="nombre" srOnly>Nombre</Form.Label>
        <Form.Control type="search" id="nombre" style={{minWidth: "10rem"}} {...register("nombre")}></Form.Control>
      </Col>
      <Col xs={"auto"}>
        <Button className="ml-2" type="submit"><FaSearch /></Button>
      </Col>
    </Form.Row>
  </Form>
}