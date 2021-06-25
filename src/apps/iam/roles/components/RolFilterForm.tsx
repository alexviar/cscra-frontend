import React from "react"
import { Form, Button, Col } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { FaSearch } from "react-icons/fa"

type Props = {
  onSearch: (texto: string) => void 
}
export const RolFilterForm = (props: Props) =>{
  const { register, handleSubmit } = useForm<{texto: string}>()
  return <Form onSubmit={handleSubmit(({texto})=>{
    props.onSearch(texto)
  })} >
    <Form.Row className="flex-nowrap">
      <Col>
        <Form.Label htmlFor="texto" srOnly>Texto</Form.Label>
        <Form.Control type="search" id="texto" style={{minWidth: "10rem"}} {...register("texto")}></Form.Control>
      </Col>
      <Col xs={"auto"}>
        <Button className="ml-2" type="submit"><FaSearch /></Button>
      </Col>
    </Form.Row>
  </Form>
}