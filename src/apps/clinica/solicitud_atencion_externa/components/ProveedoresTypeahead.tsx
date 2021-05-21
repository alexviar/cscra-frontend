
import { useEffect } from "react"
import { Button, Form, InputGroup } from "react-bootstrap"
import { FaSync } from "react-icons/fa"
import { Typeahead, TypeaheadProps } from 'react-bootstrap-typeahead'
import { useQuery } from 'react-query'
import { Proveedor, Empresa, ProveedorService } from "../services/ProveedoresService"
import { isMatch } from "../../../../commons/utils"
import 'react-bootstrap-typeahead/css/Typeahead.css'


export const ProveedoresTypeahead = ({isInvalid, feedback, filterBy, ...props}: {feedback?: string, onLoad?: (options: Proveedor[])=>void} &  Omit<TypeaheadProps<Proveedor>, "isLoading" | "options" | "onSearch">) => {
  const queryKey = "proveedores.buscar"

  const buscar = useQuery(queryKey, ()=>{
    return ProveedorService.buscar({
      activos: 1
    })
  }, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })

  useEffect(()=>{
    if(buscar.data){
      props.onLoad && props.onLoad(buscar.data?.data)
    }
  }, [buscar.data])

  return <InputGroup hasValidation>
    <Typeahead
      className={buscar.isError || isInvalid ? "is-invalid" : ""}
      isInvalid={buscar.isError || isInvalid}
      {...props}
      filterBy={(proveedor, props)=>{
        return  (!props.text || (proveedor.medico ? isMatch(proveedor.medico.nombreCompleto, props) : isMatch(proveedor.nombre, props)))
          && (!filterBy || (typeof filterBy === "function" && filterBy(proveedor, props)))
      }}
      isLoading={buscar.isFetching}
      options={buscar.data?.data || []}
      labelKey={(proveedor: Proveedor)=>{
        if(proveedor.medico){
          const medico = proveedor.medico
          const nombre_completo = medico.nombres + (medico.apellidoPaterno ? " " + medico.apellidoPaterno : "") + (medico.apellidoMaterno ? " " + medico.apellidoMaterno : "")
          return nombre_completo
        }
        else {
          return (proveedor as Empresa).nombre
        }
      }}
      minLength={0}
      renderMenuItemChildren={(proveedor) => {
        let title, subtitle;
        if(proveedor.medico){
          const medico = proveedor.medico
          title = medico.nombres + (medico.apellidoPaterno ? " " + medico.apellidoPaterno : "") + (medico.apellidoMaterno ? " " + medico.apellidoMaterno : "")
          subtitle = medico.especialidad
        }
        else {
          title = proveedor.nombre
          subtitle = "Empresa"
        }
        return <div>
          <div>{title}</div>
          <div className={"small text-secondary"}>{subtitle}</div> 
        </div>
      }}
    />
    {buscar.isError ? <>
      <InputGroup.Append>
        <Button variant="outline-danger" onClick={()=>buscar.refetch()}><FaSync /></Button>
      </InputGroup.Append>
      <Form.Control.Feedback type="invalid">{buscar.error?.response?.message || buscar.error?.message}</Form.Control.Feedback>
    </>
    : null}
    {feedback ? <Form.Control.Feedback type="invalid">{feedback}</Form.Control.Feedback> : null}
  </InputGroup>
}