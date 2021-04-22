
import { forwardRef, useEffect, useRef, useState } from "react"
import { AsyncTypeahead, AsyncTypeaheadProps } from 'react-bootstrap-typeahead'
import { useQuery, useQueryClient } from 'react-query'
import { Regional, RegionalesService } from "../services/RegionalesService";
import 'react-bootstrap-typeahead/css/Typeahead.css';


export const RegionalesTypeahead = (props: Omit<AsyncTypeaheadProps<Regional>, "isLoading" | "options" | "onSearch">) => {

  const [options, setOptions] = useState<Regional[]>([])

  const queryKey = "obtenerRegionales"

  const buscar = useQuery(queryKey, ()=>{
    return RegionalesService.obtener()
  }, {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onSuccess: ({data})=>{
      setOptions(data)
    }
  })

  return <AsyncTypeahead
    {...props}
    // filterBy={()=>true}
    isLoading={buscar.isFetching}
    options={options}
    labelKey="nombre"
    useCache={false}
    // maxResults={10}
    minLength={0}
    onSearch={(newQuery)=>{
      // setOptions(buscar.data?.data.filter(r=>r.nombre.includes(newQuery))||[])
    }}
    renderMenuItemChildren={(prestacion) => {
      return prestacion.nombre
    }}
  />
}