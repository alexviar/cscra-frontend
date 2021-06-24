import { useState } from "react"
import { Card, Accordion, Form, Table, Button } from "react-bootstrap"
import { useFormContext, useFieldArray, Controller, useController } from "react-hook-form"
import { FaPlus, FaMinus } from "react-icons/fa"
import { Prestacion, PrestacionesTypeahead } from "./PrestacionesTypeahead"
import { Proveedor, ProveedoresTypeahead } from "./ProveedoresTypeahead"
import { Regional } from "../../../../commons/services"

export type PrestacionesSolicitadasInputs = {
  regional: Regional[],
  prestacionesSolicitadas: {
    id: number,
    prestacion: Prestacion[],
    nota: string,
  }[],
  proveedor?: Proveedor[]
}

export const PrestacionesSolicitadasCard = () => {
  const [count, setCount] = useState(1)
  const { register, control, formState, watch } = useFormContext<PrestacionesSolicitadasInputs>()
  const proveedoresTypeaheadController = useController({
    name:"proveedor",
    control
  })
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
                    name={`prestacionesSolicitadas.${index}.prestacion` as const}
                    control={control}
                    render={({ field, fieldState }) => {
                      return <>
                        <PrestacionesTypeahead
                          id={`solicitud-atencion-externa/prestacionesSolicitadas.${index}.prestacion`}
                          allowNew={false}
                          className={!!fieldState.error ? "is-invalid" : ""}
                          isInvalid={!!fieldState.error}
                          filterBy={(prestacion) => {
                            const proveedor = watch("proveedor.0")
                            const prestacionesSolicitadas = watch("prestacionesSolicitadas")
                            return !proveedor ||
                              proveedor.contrato.prestaciones.some(pc => pc.id == prestacion.id) && 
                              !prestacionesSolicitadas.some(ps=>ps.prestacion?.length && ps.prestacion[0].id == prestacion.id)
                          }}
                          feedback={fieldState.error?.message}
                          selected={field.value}
                          onBlur={field.onBlur}
                          onChange={field.onChange}
                        />
                      </>
                    }}
                  />
                </td>
                <td>
                  <ProveedoresTypeahead
                    id={`solicitud-atencion-externa/proveedor`}
                    className={proveedoresTypeaheadController.fieldState?.error ? "is-invalid" : ""}
                    isInvalid={!!proveedoresTypeaheadController.fieldState?.error}
                    filter={{
                      activos: 1
                    }}
                    filterBy={(proveedor)=> !!(
                      proveedor.regionalId == watch("regional.0.id") &&
                      watch("prestacionesSolicitadas").every(ps=> proveedor.contrato.prestaciones.some(pc=>pc.id == (ps.prestacion.length && ps.prestacion[0].id)))
                    )}
                    feedback={proveedoresTypeaheadController.fieldState?.error?.message}
                    onChange={proveedoresTypeaheadController.field.onChange}
                    onBlur={proveedoresTypeaheadController.field.onBlur}
                    selected={proveedoresTypeaheadController.field.value}
                  />
                </td>
                <td>
                  <Form.Control as="textarea" 
                    isInvalid={!!(formState.errors.prestacionesSolicitadas && formState.errors.prestacionesSolicitadas[index]?.nota)}
                    {...register(`prestacionesSolicitadas.${index}.nota` as const)}
                  />
                  <Form.Control.Feedback type="invalid">{formState.errors.prestacionesSolicitadas && formState.errors.prestacionesSolicitadas[index]?.nota?.message}</Form.Control.Feedback>
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