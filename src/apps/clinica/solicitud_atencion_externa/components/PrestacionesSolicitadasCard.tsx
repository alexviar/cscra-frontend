import { useState } from "react"
import { Card, Accordion, Form, Table, Button } from "react-bootstrap"
import { useFormContext, useFieldArray, Controller, useController } from "react-hook-form"
import { FaPlus, FaMinus } from "react-icons/fa"
import { Regional } from "../../../../commons/services"

export type PrestacionesSolicitadasInputs = {
  regional: Regional[],
  prestacionesSolicitadas: {
    id: number,
    prestacion: string
  }[],
  proveedor?: string
}

export const PrestacionesSolicitadasCard = () => {
  const [count, setCount] = useState(1)
  const { register, control, formState, watch } = useFormContext<PrestacionesSolicitadasInputs>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prestacionesSolicitadas"
  })

  const formErrors = formState.errors
  const hasErrors = !!formErrors.prestacionesSolicitadas || !!formErrors.proveedor

  return <Card style={{ overflow: "visible" }} >
    <Accordion.Toggle as={Card.Header} className={"text-light " + (hasErrors ? "bg-danger" : "bg-primary")} eventKey="3">
      Prestaciones
    </Accordion.Toggle>
    <Accordion.Collapse eventKey="3">
      <div>
        <Table className={formErrors.prestacionesSolicitadas ? "is-invalid": ""}>
          <thead>
            <tr>
              <th style={{ width: 1 }}>#</th>
              <th>Prestacion</th>
              <th>Proveedor</th>
              <th style={{ width: 1 }}></th>
            </tr>
          </thead>
          <tbody>
            {fields.map((prestacionSolicitada, index) => {
              return <tr key={prestacionSolicitada.id}>
                <td>{index + 1}</td>
                <td>
                  <Form.Control 
                    isInvalid={!!(formState.errors.prestacionesSolicitadas && formState.errors.prestacionesSolicitadas[index]?.prestacion)}
                    {...register(`prestacionesSolicitadas.${index}.prestacion` as const)}
                  />
                  <Form.Control.Feedback type="invalid">{
                    formState.errors.prestacionesSolicitadas && 
                    formState.errors.prestacionesSolicitadas[index]?.prestacion?.message
                  }</Form.Control.Feedback>
                </td>
                <td>
                  <Form.Control
                    isInvalid={!!formState.errors.proveedor}
                    {...register("proveedor")}
                  />
                  <Form.Control.Feedback type="invalid">{
                    formState.errors.proveedor?.message
                  }</Form.Control.Feedback>
                </td>
                <td>
                  {/* <Button variant="link" onClick={() => {
                    console.log("Remove", index)
                    remove(index)
                  }} className="btn-icon"><FaMinus /></Button> */}
                </td>
              </tr>
            })}
            {/* <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <Button variant="link" onClick={() => {
                  console.log(count)
                  append({
                    id: count
                  })
                  setCount(count => count+1)
                }} className="btn-icon"><FaPlus /></Button>
              </td>
            </tr> */}
          </tbody>
        </Table>
        <Form.Control.Feedback type="invalid">{
          //@ts-ignore
          formErrors.prestacionesSolicitadas?.message}</Form.Control.Feedback>
      </div>
    </Accordion.Collapse>
  </Card>
}