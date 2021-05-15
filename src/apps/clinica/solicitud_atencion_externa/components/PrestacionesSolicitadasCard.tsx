import { useState } from "react"
import { Card, Accordion, Form, Table, Button } from "react-bootstrap"
import { useFormContext, useFieldArray, Controller, useController } from "react-hook-form"
import { FaPlus, FaMinus } from "react-icons/fa"
import { PrestacionesTypeahead } from "./PrestacionesTypeahead"
import * as rules from "../../../../commons/components/rules"
import { Proveedor } from "../services/ProveedoresService"
import { ProveedoresTypeahead } from "./ProveedoresTypeahead"

export type PrestacionesSolicitadasInputs = {
  regionalId: number | null,
  prestacionesSolicitadas: {
    id: number,
    prestacionId: number | null,
    nota: string,
  }[],
  proveedor?: Proveedor[]
}

export const PrestacionesSolicitadasCard = () => {
  const [count, setCount] = useState(1)
  const { register, control, formState, watch } = useFormContext<PrestacionesSolicitadasInputs>()
  const proveedoresTypeaheadController = useController({
    name:"proveedor",
    control,
    rules: {
      required: rules.required()
    }
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: "prestacionesSolicitadas",
    keyName: "prestacionId"
  })
  return <Card style={{ overflow: "visible" }} >
    <Accordion.Toggle as={Card.Header} className="bg-primary text-light" eventKey="3">
      Prestaciones
    </Accordion.Toggle>
    <Accordion.Collapse eventKey="3">
      <Table>
        <thead>
          <tr>
            <th style={{ width: 1 }}>#</th>
            <th>Prestacion</th>
            <th>Proveedor</th>
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
                  render={({ field, fieldState }) => {
                    return <>
                      <PrestacionesTypeahead
                        id={`solicitud-atencion-externa/prestacionesSolicitadas.${index}.prestacionId`}
                        className={!!fieldState.error ? "is-invalid" : ""}
                        isInvalid={!!fieldState.error}
                        filterBy={(prestacion) => {
                          const proveedor = watch("proveedor.0")
                          const prestacionesSolicitadas = watch("prestacionesSolicitadas")
                          return !proveedor ||
                            proveedor.contrato.prestaciones.some(pc => pc.id == prestacion.id) && 
                            !prestacionesSolicitadas.some(ps=>ps.prestacionId == prestacion.id)
                        }}
                        onBlur={field.onBlur}
                        onChange={(prestacion) => {
                          field.onChange(prestacion.length ? prestacion[0].id : 0)
                        }}
                      />
                      <Form.Control.Feedback type="invalid">{fieldState.error?.message}</Form.Control.Feedback>
                    </>
                  }}
                />
              </td>
              <td>
                <ProveedoresTypeahead
                  id={`solicitud-atencion-externa/proveedor`}
                  filter={{
                    activos: 1,
                  }}
                  className={proveedoresTypeaheadController.fieldState?.error ? "is-invalid" : ""}
                  isInvalid={!!proveedoresTypeaheadController.fieldState?.error}
                  filterBy={(proveedor)=>(!watch("regionalId") || proveedor.regionalId == watch("regionalId")) && watch("prestacionesSolicitadas").every(ps=>proveedor.contrato.prestaciones.some(pc=>pc.id == ps.prestacionId))}
                  onChange={proveedoresTypeaheadController.field.onChange}
                  onBlur={proveedoresTypeaheadController.field.onBlur}
                  selected={proveedoresTypeaheadController.field.value}
                />
                <Form.Control.Feedback type="invalid">{proveedoresTypeaheadController.fieldState?.error?.message}</Form.Control.Feedback>
              </td>
              <td>
                <Form.Control as="textarea" {...register(`prestacionesSolicitadas.${index}.nota` as const)} />
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