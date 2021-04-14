import { useState } from "react"
import { Card, Accordion, Form, Table, Button } from "react-bootstrap"
import { useFormContext, useFieldArray, Controller } from "react-hook-form"
import { FaPlus, FaMinus } from "react-icons/fa"
import { PrestacionesTypeahead } from "./PrestacionesTypeahead"
import * as rules from "../../../../commons/components/rules"
import { createIndexSignature } from "typescript"

export type PrestacionesSolicitadasInputs = {
  prestacionesSolicitadas: {
    id: number,
    prestacionId: number,
    nota: string,
  }[],
  proveedor: {
    id: number,
    nombre: string,
    prestacionesContratadas: {
      id: number
    }[]
  }
}

export const PrestacionesSolicitadasCard = () => {
  const [count, setCount] = useState(1)
  const { register, control, formState, watch } = useFormContext<PrestacionesSolicitadasInputs>()
  const { fields, append, remove } = useFieldArray<PrestacionesSolicitadasInputs>({
    name: "prestacionesSolicitadas"
  })
  return <Card style={{ overflow: "visible" }} >
    <Accordion.Toggle as={Card.Header} className="bg-primary text-light" eventKey="2">
      Prestaciones
    </Accordion.Toggle>
    <Accordion.Collapse eventKey="2">
      <Table>
        <thead>
          <tr>
            <th style={{ width: 1 }}>#</th>
            <th>Nombre</th>
            <th>Nota</th>
            <th style={{ width: 1 }}></th>
          </tr>
        </thead>
        <tbody>
          {fields.map((prestacionSolicitada, index) => {
            return <tr key={prestacionSolicitada.id}>
              <td>{index + 1}</td>
              <td>
                <Controller
                  name={`prestacionesSolicitadas.${index}.prestacionId` as const}
                  control={control}
                  rules={{
                    required: rules.required(),
                  }}
                  render={({ field }) => {
                    return <PrestacionesTypeahead
                      id={`solicitud-atencion-externa/prestacionesSolicitadas.${index}.prestacionId`}
                      filterBy={(prestacion) => {
                        const proveedor = watch("proveedor")
                        return !proveedor || proveedor.prestacionesContratadas.some(pc => pc.id == prestacion.id)
                      }}
                      onBlur={field.onBlur}
                      onChange={(prestacion) => {
                        field.onChange(prestacion.length ? prestacion[0].id : 0)
                      }}
                    />
                  }}
                />
              </td>
              <td>
                <Form.Control as="textarea" {...register(`prestacionesSolicitadas.${index}.nota` as const, {
                  required: rules.required()
                })} />
              </td>
              <td>
                <Button variant="link" onClick={() => {
                  console.log("Remove", index)
                  remove(index)
                }} className="btn-icon"><FaMinus /></Button>
              </td>
            </tr>
          })}
          <tr>
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
          </tr>
        </tbody>
      </Table>
    </Accordion.Collapse>
  </Card>
}