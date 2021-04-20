
import { forwardRef, useEffect, useRef, useState } from "react"
import { AsyncTypeahead, AsyncTypeaheadProps } from 'react-bootstrap-typeahead'
import { useQuery, useQueryClient } from 'react-query'
import { Proveedor, Empresa, ProveedorService } from "../services/ProveedoresService"
import { Medico } from "../services/MedicosService";
import 'react-bootstrap-typeahead/css/Typeahead.css';


export const ProveedoresTypeahead = (props: Omit<AsyncTypeaheadProps<Proveedor>, "isLoading" | "options" | "onSearch">) => {
  const [query, setQuery] = useState("")
  const queryKey = ["buscarProveedor", query]
  const buscar = useQuery(queryKey, ()=>{
    return ProveedorService.buscarPorNombre(query)
  }, {
    enabled: false,
  })
  const queryClient = useQueryClient()
  
  useEffect(()=>{
    if(query && !buscar.data){
      buscar.refetch()
    }
  }, [query])

  return <AsyncTypeahead flip {...props}
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
    useCache={false}
    filterBy={()=>true}
    maxResults={10}
    minLength={2}
    onSearch={(newQuery)=>{
      console.log("Query", newQuery)
      queryClient.cancelQueries(queryKey)
      setQuery(newQuery)
    }}
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