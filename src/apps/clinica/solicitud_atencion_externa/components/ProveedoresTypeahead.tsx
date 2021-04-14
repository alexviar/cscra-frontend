
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
    options={buscar.data?.data.records || []}
    labelKey={(proveedor: Proveedor)=>{
      if((proveedor as Medico).especialidad){
        const medico = (proveedor as Medico)
        const nombre_completo = (medico.apellidoPaterno ? medico.apellidoPaterno + " " : "") + `${medico.apellidoMaterno} ${medico.nombres}`.trim()
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
      if((proveedor as Medico).especialidad){
        const medico = (proveedor as Medico)
        title = (medico.apellidoPaterno ? medico.apellidoPaterno + " " : "") + `${medico.apellidoMaterno} ${medico.nombres}`
        subtitle = medico.especialidad
      }
      else {
        title = (proveedor as Empresa).nombre
        subtitle = "empresa"
      }
      return <div>
        <div>{title}</div>
        <div className={"small text-secondary"}>{subtitle}</div> 
      </div>
    }}
  />
}