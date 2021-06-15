
import { useEffect, useMemo } from "react"
import { Button, Form, InputGroup } from "react-bootstrap"
import { FaSync } from "react-icons/fa"
import { Typeahead, TypeaheadProps } from 'react-bootstrap-typeahead'
import { useQuery } from 'react-query'
import { AxiosError } from 'axios'
import { Proveedor, Filter as ProveedorFilter, ProveedoresService } from "../services"
import { isMatch } from "../../../../commons/utils"
import 'react-bootstrap-typeahead/css/Typeahead.css'

export type { Proveedor }

type Props = {
  feedback?: string,
  filter?: ProveedorFilter
  onLoad?: (options: Proveedor[])=>void
} & Omit<TypeaheadProps<Proveedor>, "isLoading" | "options">

export const ProveedoresTypeahead = ({isInvalid, feedback, filter={}, filterBy, ...props}: Props) => {
  const queryKey = ["proveedores.buscar", filter]

  const buscar = useQuery(queryKey, ()=>{
    return ProveedoresService.buscar(filter)
  }, {
    // refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })

  useEffect(()=>{
    if(buscar.data){
      props.onLoad && props.onLoad(buscar.data?.data)
    }
  }, [buscar.data])

  const options = useMemo(()=>{
    if(Array.isArray(buscar.data?.data)){
        return buscar.data?.data!
    }
    else if(buscar.data?.data){
        console.error(buscar.data?.data)
    }
    return []
  }, [buscar.data?.data])

  return <InputGroup hasValidation>
    <Typeahead
      clearButton
      {...props}
      disabled={!buscar.data}
      className={(buscar.isError || isInvalid) ? "is-invalid" : ""}
      isInvalid={buscar.isError || isInvalid}
      filterBy={(proveedor, props)=>{
        return  (!props.text || (proveedor.nombre ? isMatch(proveedor.nombre, props) : isMatch(proveedor.nombreCompleto, props)))
          && (!filterBy || (typeof filterBy === "function" && filterBy(proveedor, props)))
      }}
      isLoading={buscar.isFetching}
      options={options}
      labelKey={(proveedor: Proveedor)=>{
        return proveedor.nombre || proveedor.nombreCompleto
      }}
      minLength={0}
      renderMenuItemChildren={(proveedor) => {
        return <div>
          <div>{proveedor.nombre || proveedor.nombreCompleto}</div>
          <div className={"small text-secondary"}>{proveedor.especialidad?.nombre || "Empresa"}</div> 
        </div>
      }}
    />
    <InputGroup.Append>
      <Button disabled={buscar.isFetching} variant={buscar.isError ? "outline-danger" : "outline-secondary"} onClick={()=>buscar.refetch()}><FaSync /></Button>
    </InputGroup.Append>
    <Form.Control.Feedback type="invalid">{
      (buscar.error as AxiosError)?.response?.data?.message || (buscar.error as AxiosError)?.message
      || feedback}</Form.Control.Feedback>
  </InputGroup>
}