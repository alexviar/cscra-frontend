import { useEffect } from "react"
import { Button, Col, Form } from "react-bootstrap"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import { FaPlus } from "react-icons/fa"
import { PrestacionesTypeahead } from "../../solicitud_atencion_externa/components/PrestacionesTypeahead"
import { Prestacion } from "../../prestaciones/services"
import { ArancelesControl } from "./ArancelesControl"

export type Inputs = {
  prestaciones: {
    id: string
    prestacion: Prestacion,
    // aranceles: {
    //   nombre: string,
    //   precio: string,
    //   etiqueta: string
    // }[]
  }[]
}

export const PrestacionesContratadasControl = ()=>{
  const {
    register,
    control,
    trigger,
    formState: { errors: formErrors },
    watch
  } = useFormContext<Inputs>()
  const {
    fields,
    append,
    remove
  } = useFieldArray({
    name: "prestaciones",
    control
  })

  return <div>
    <h2 style={{fontSize: "1.25rem"}}>Prestaciones contratadas</h2>
    <div className={formErrors.prestaciones ? "is-invalid" : ""}>
      {fields.map((field,index)=>{
        return <Form.Row key={field.id} className="py-2 border-bottom">
          <Form.Group as={Col} xs={12}>
            {/* <Form.Label>
              Prestaciones
            </Form.Label> */}
              <Controller
                name={`prestaciones.${index}.prestacion` as const}
                control={control}
                render={({ field, fieldState }) => {
                  return <>
                  <Form.Row>
                    <Col>
                      <PrestacionesTypeahead
                        id={`proveedor-contrato/prestaciones.${index}`}
                        className={!!fieldState.error ? "is-invalid" : ""}
                        isInvalid={!!fieldState.error}
                        filterBy={(prestacion) => {
                          const prestaciones = watch("prestaciones")
                          return !prestaciones.some(p=>p.prestacion?.id == prestacion.id)
                        }}
                        selected={field.value ? [field.value]:[]}
                        onChange={(prestacion) => {
                          field.onChange(prestacion.length ? prestacion[0] : 0)
                        }}
                        onBlur={field.onBlur}
                        feedback={fieldState.error?.message}
                      />
                    </Col>
                    <Col xs="auto">
                        <Button variant="danger" onClick={()=>{
                          remove(index)
                        }}>
                          Quitar
                        </Button>
                    </Col>
                  </Form.Row>
                  </>
                }}
              />
          </Form.Group>
          {/* <Col className="px-3" xs={12}>
            <ArancelesControl index={index} />
          </Col> */}
        </Form.Row>
      })}
    </div>
    <Form.Control.Feedback type="invalid">{
      //@ts-ignore
      formErrors.prestaciones?.message}</Form.Control.Feedback>
    <Form.Row className="py-2">
      <Col className="ml-auto" xs={"auto"}>
        <Button
          onClick={()=>{
            append({
              // aranceles: [{
              //   nombre: "",
              //   precio: "",
              //   etiqueta: ""
              // }]
            })
          }}
        >Agregar</Button>
      </Col>
    </Form.Row>
  </div>
}