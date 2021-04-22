
import { forwardRef, useEffect, useRef, useState } from "react"
import { AsyncTypeahead, AsyncTypeaheadProps } from 'react-bootstrap-typeahead'
import { useQuery, useQueryClient } from 'react-query'
import { Proveedor, Empresa, ProveedorService } from "../services/ProveedoresService"
import { Medico } from "../services/MedicosService";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Prestacion, PrestacionesService } from "../services/PrestacionesService";


export const PrestacionesTypeahead = (props: Omit<AsyncTypeaheadProps<Prestacion>, "isLoading" | "options" | "onSearch">) => {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const queryKey = ["buscarPrestaciones", query, page]
  const buscar = useQuery(queryKey, ()=>{
    return PrestacionesService.buscar({
      nombre: query||undefined
    }, {
      size: 50,
      current: page
    })
  }, {
    enabled: false,
  })
  const queryClient = useQueryClient()
  
  useEffect(()=>{
    if(!buscar.data){
      buscar.refetch()
    }
  }, [query])

  return <AsyncTypeahead flip
    filterBy={()=>true}
    {...props}
    isLoading={buscar.isFetching}
    options={buscar.data?.data?.records || []}
    labelKey="nombre"
    useCache={false}
    maxResults={50}
    minLength={0}
    onSearch={(newQuery)=>{
      queryClient.cancelQueries(queryKey)
      setQuery(newQuery)
    }}
    paginate
    onPaginate={(e, size)=>{
      setPage((page => page + 1))
    }}
    renderMenuItemChildren={(prestacion) => {
      return prestacion.nombre
    }}
  />
}