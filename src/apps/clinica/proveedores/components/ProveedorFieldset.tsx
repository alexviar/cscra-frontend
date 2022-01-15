
import { useState, useEffect } from "react"
import { Form, Col } from "react-bootstrap"
import { useFormContext } from "react-hook-form"
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
    <legend>Registro de proveedores</legend>
    <Form.Group as={Form.Row}>
      <Form.Label column sm={"auto"}>Tipo de proveedor</Form.Label>
      <Col className="d-flex" xs={"auto"}>
        <Form.Check disabled={!!id} inline type="radio" label="Médico" {...tipoField}></Form.Check>
        <Form.Check disabled={!!id} inline type="radio" label="Empresa" {...tipoField} onChange={(e) => {
          if (e.target.checked && !id)
            tipoField.onChange(e)
        }} ></Form.Check>
      </Col>
    </Form.Group>
    {renderSpecificFieldset()}
  </fieldset>
}