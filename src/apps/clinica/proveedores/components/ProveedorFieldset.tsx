
import { useState, useEffect } from "react"
import { Form, Col } from "react-bootstrap"
import { Controller, useFormContext } from "react-hook-form"
import { useHistory, useParams } from "react-router"
import { useQuery } from "react-query"
import { useModal } from "../../../../commons/reusable-modal"
import { Inputs as EmpresaInputs, ProveedorEmpresaFieldset } from "./ProveedorEmpresaFieldset"
import { Inputs as MedicoInput, ProveedorMedicoFieldset } from "./ProveedorMedicoFieldset"
import { Proveedor, ProveedoresService } from "../services"

export type Inputs = EmpresaInputs | MedicoInput

export const ProveedorFieldset = () => {

  const { id } = useParams<{ id?: string }>()

  const {
    clearErrors,
    control,
    register,
    watch
  } = useFormContext<Inputs>()

  const tipo = watch("tipo")
  
  useEffect(()=>{
    clearErrors()
  }, [tipo])

  const renderSpecificFieldset = () => {
    if (tipo == 1) {
      return <ProveedorMedicoFieldset />
    }
    if (tipo == 2) {
      return <ProveedorEmpresaFieldset />
    }
    return null
  }

  const tipoField = register("tipo")

  return <fieldset>
    <legend>Información general</legend>
    <Form.Row>
      <Form.Group as={Col} md={4}>
        <Form.Label>Tipo de proveedor</Form.Label>
        <Controller
          control={control}
          name="tipo"
          render={({field: {value, ...field}, fieldState})=>{
            return !id ? <>
              <Form.Row className={fieldState.error ? "is-invalid" : ""}>
                <Col>
                  <Form.Check 
                    // disabled={!!id}
                    readOnly={!!id}
                    type="radio"
                    value={1}
                    checked={value == 1}
                    label="Médico"
                    isInvalid={!!fieldState.error}
                    {...field}
                  />
                </Col>
                <Col>
                  <Form.Check
                    // disabled={!!id}
                    readOnly={!!id}
                    type="radio"
                    value={2}
                    checked={value == 2}
                    label="Empresa" 
                    isInvalid={!!fieldState.error}
                    {...field} 
                  />
                </Col>
              </Form.Row>
              <Form.Control.Feedback type="invalid">{fieldState.error?.message}</Form.Control.Feedback>
            </> : <Form.Control readOnly value={value == 1 ? "MÉDICO" : "EMPRESA"} />
          }}
        />        
      </Form.Group>
    </Form.Row>
    {renderSpecificFieldset()}
  </fieldset>
}