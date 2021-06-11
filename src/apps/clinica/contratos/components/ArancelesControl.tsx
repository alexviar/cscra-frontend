import { Button, Card, Col, Form, Table } from "react-bootstrap"
import { BiMoveVertical, BiDuplicate } from "react-icons/bi"
import { FaTrashAlt } from "react-icons/fa"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"

export const ArancelesControl = ({index}: {index: number})=>{
  const {
    control
  } = useFormContext()

  const {
    fields,
    append
  } = useFieldArray({
    name: `prestaciones.${index}.aranceles` as const,
    control
  })

  // return <>
  //   {fields.map((field, arancelIndex)=>{
  //     return <Card><Card.Body><Form.Row>
  //       <Form.Group as={Col} xs={12} lg={6}>
  //         <Form.Label>Concepto</Form.Label>
  //         <Form.Control />
  //       </Form.Group>
  //       <Form.Group as={Col} xs={5} lg={2}>
  //         <Form.Label>Precio</Form.Label>
  //         <Form.Control />
  //       </Form.Group>
  //       <Form.Group as={Col} xs={7} lg={4}>
  //         <Form.Label>Etiqueta</Form.Label>
  //         <Form.Control />
  //       </Form.Group>
  //       <Col>
  //         <Form.Row className="flex-nowrap">
  //           <Col className="ml-auto" xs="auto">
  //             <Button>
  //               <BiDuplicate /><span className="ml-1 align-middle">Duplicar</span>
  //             </Button>
  //           </Col>
  //           <Col xs="auto">
  //             <Button variant="danger">
  //               <FaTrashAlt /><span className="ml-1 align-middle">Eliminar</span>
  //             </Button>
  //           </Col>
  //         </Form.Row>
  //       </Col>
  //     </Form.Row></Card.Body></Card>
  //   })}
  //   <Form.Row className="my-2">
  //     <Col className="ml-auto" xs="auto">
  //       <Button onClick={()=>{
  //         append({})
  //       }}>
  //         Agregar
  //       </Button>
  //     </Col>
  //   </Form.Row>
  // </>

  return <Table responsive>
    <thead>
      <tr>
        <th style={{width: 1}}></th>
        <th style={{width: "80%", minWidth: 300}}>Concepto</th>
        <th style={{minWidth: 150}}>Precio</th>
        <th style={{minWidth: 200}}>Etiqueta</th>
        <th style={{width: 1}}></th>
      </tr>
    </thead>
    <tbody>
      {fields.map((field, arancelIndex)=>{
        return <tr>
          <td style={{width: 1}}>
            {/* <Button> */}
              <BiMoveVertical/>
            {/* </Button> */}
          </td>
          <td>
            <Form.Control />
          </td>
          <td>
            <Form.Control />
          </td>
          <td>
            <Form.Control />
          </td>
          <td>
            <Form.Row className="flex-nowrap">
              <Col>
                <Button>
                  <BiDuplicate />
                </Button>
              </Col>
              <Col>
                <Button as={Col}>
                  <FaTrashAlt />
                </Button>
              </Col>
            </Form.Row>
          </td>
        </tr>
      })}
      <tr>
        <td colSpan={4}>
        </td>
        <td className="text-right">
          <Button onClick={()=>{
            append({})
          }}>
            +
          </Button>
        </td>
      </tr>
    </tbody>
  </Table>
}