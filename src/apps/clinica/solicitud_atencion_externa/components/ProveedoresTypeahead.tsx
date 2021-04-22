
import { forwardRef, useEffect, useRef, useState } from "react"
import { AsyncTypeahead, AsyncTypeaheadProps } from 'react-bootstrap-typeahead'
import { useQuery, useQueryClient } from 'react-query'
import { Proveedor, Empresa, ProveedorService } from "../services/ProveedoresService"
import { Medico } from "../services/MedicosService";
import 'react-bootstrap-typeahead/css/Typeahead.css';


export const ProveedoresTypeahead = (props: Omit<AsyncTypeaheadProps<Proveedor>, "isLoading" | "options" | "onSearch">) => {
  // const [query, setQuery] = useState("")
  // const [options, setOptions] = useState<Proveedor[]>([])

  
  const queryKey = "buscarProveedor"
  const buscar = useQuery(queryKey, ()=>{
    // return ProveedorService.buscarPorNombre(query)
    return ProveedorService.buscar()
  }, {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // enabled: false,
    // onSuccess: ({data})=>{
    //   setOptions(data)
    // }
  })

  return <AsyncTypeahead flip 
    // filterBy={()=>true}
    {...props}
    isLoading={buscar.isFetching}
    options={buscar.data?.data || []}
    // options={options}
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
    useCache={false}
    maxResults={50}
    minLength={0}
    onSearch={(newQuery)=>{}}
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
}