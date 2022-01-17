
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
    control,
    register,
    watch
  } = useFormContext<Inputs>()

  const renderSpecificFieldset = () => {
    if (watch("tipo") == 1) {
      return <ProveedorMedicoFieldset />
    }
    if (watch("tipo") == 2) {
      return <ProveedorEmpresaFieldset />
    }
    return null
  }

  const tipoField = register("tipo")

  return <fieldset>
    <legend>Información general</legend>
    <Form.Row>
      <Form.Group as={Col} sm={4}>
        <Form.Label>Tipo de proveedor</Form.Label>
        <Controller
          control={control}
          name="tipo"
          render={({field, fieldState})=>{
            return <>
              <Form.Row className={fieldState.error ? "is-invalid" : ""}>
                <Col>
                  <Form.Check 
                    disabled={!!id}
                    type="radio"
                    value={1}
                    checked={field.value == 1}
                    label="Médico"
                    isInvalid={!!fieldState.error}
                    {...tipoField}
                    onChange={(e) => {
                    if (e.target.checked && !id)
                      tipoField.onChange(e)
                    }} 
                  />
                </Col>
                <Col>
                  <Form.Check
                    disabled={!!id}
                    type="radio"
                    value={2}
                    checked={field.value == 2}
                    label="Empresa" 
                    isInvalid={!!fieldState.error}
                    {...tipoField} 
                    onChange={(e) => {
                    if (e.target.checked && !id)
                      tipoField.onChange(e)
                    }} 
                  />
                </Col>
              </Form.Row>
              <Form.Control.Feedback type="invalid">{fieldState.error?.message}</Form.Control.Feedback>
            </>
          }}
        />        
      </Form.Group>
    </Form.Row>
    {renderSpecificFieldset()}
  </fieldset>
}