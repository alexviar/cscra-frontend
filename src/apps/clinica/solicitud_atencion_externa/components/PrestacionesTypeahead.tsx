
import { forwardRef, useEffect, useRef, useState } from "react"
import { AsyncTypeahead, AsyncTypeaheadProps } from 'react-bootstrap-typeahead'
import { useQuery, useQueryClient } from 'react-query'
import { Proveedor, Empresa, ProveedorService } from "../services/ProveedoresService"
import { Medico } from "../services/MedicosService";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Prestacion, PrestacionesService } from "../services/PrestacionesService";


export const PrestacionesTypeahead = (props: Omit<AsyncTypeaheadProps<Prestacion>, "isLoading" | "options" | "onSearch">) => {
  const [query, setQuery] = useState("")
  const queryKey = ["buscarPrestaciones", query]
  const buscar = useQuery(queryKey, ()=>{
    return PrestacionesService.buscarPorNombre(query)
  }, {
    enabled: false,
  })
  const queryClient = useQueryClient()
  
  useEffect(()=>{
    if(query && !buscar.data){
      buscar.refetch()
    }
  }, [query])

  return <AsyncTypeahead flip
    filterBy={()=>true}
    {...props}
    isLoading={buscar.isFetching}
    options={buscar.data?.data || []}
    labelKey="nombre"
    useCache={false}
    maxResults={10}
    minLength={2}
    onSearch={(newQuery)=>{
      queryClient.cancelQueries(queryKey)
      setQuery(newQuery)
    }}
    renderMenuItemChildren={(prestacion) => {
      return prestacion.nombre
    }}
  />
}