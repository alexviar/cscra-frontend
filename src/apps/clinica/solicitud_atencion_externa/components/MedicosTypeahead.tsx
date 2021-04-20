
import { forwardRef, useEffect, useRef, useState } from "react"
import { AsyncTypeahead, AsyncTypeaheadProps } from 'react-bootstrap-typeahead'
import { useQuery, useQueryClient } from 'react-query'
import { Medico, MedicosService } from "../services/MedicosService"
import 'react-bootstrap-typeahead/css/Typeahead.css';


export const MedicosTypeahead = (props: Omit<AsyncTypeaheadProps<Medico>, "isLoading" | "options" | "onSearch">) => {
  const [query, setQuery] = useState("")

  const queryKey = ["buscarMedico", query];
  const buscar = useQuery(queryKey, ()=>{
    return MedicosService.buscarPorNombre(query)
  }, {
    enabled: false,
  })
  const queryClient = useQueryClient()
  
  useEffect(()=>{
    if(query && !buscar.data){
      buscar.refetch()
    }
  }, [query])

  console.log("Medicos", query, buscar.isFetching, buscar.isError, buscar.isIdle, buscar.isStale, buscar.data?.data.records, Date.now())
  return <AsyncTypeahead flip
    filterBy={()=>true}
    {...props}
    isLoading={buscar.isFetching}
    options={buscar.data?.data.records || []}
    labelKey={(medico)=>{
      const nombre_completo = (medico.apellidoPaterno ? medico.apellidoPaterno + " " : "") + `${medico.apellidoMaterno} ${medico.nombres}`.trim()
      return nombre_completo
    }}
    useCache={false}
    maxResults={10}
    minLength={2}
    onSearch={(newQuery)=>{
      queryClient.cancelQueries(queryKey)
      setQuery(newQuery)
    }}
    renderMenuItemChildren={(medico) => {
      const nombre_completo = (medico.apellidoPaterno ? medico.apellidoPaterno + " " : "") + `${medico.apellidoMaterno} ${medico.nombres}`.trim()
      return <div>
        <div>{nombre_completo}</div>
        <div className={"small text-secondary"}>{medico.especialidad}</div> 
      </div>
    }}
  />
}