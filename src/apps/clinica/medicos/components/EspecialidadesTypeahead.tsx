
import { forwardRef, MutableRefObject, useEffect, useRef, useState } from "react"
import { AsyncTypeahead, AsyncTypeaheadProps } from 'react-bootstrap-typeahead'
import { useQuery, useQueryClient } from 'react-query'
import { Especialidad, EspecialidadesService } from "../../especialidades/services";
import 'react-bootstrap-typeahead/css/Typeahead.css';


export const EspecialidadesTypeahead = (props: {onLoad?: (options: Especialidad[])=>void} & Omit<AsyncTypeaheadProps<Especialidad>, "isLoading" | "options" | "onSearch">) => {


  const queryKey = "obtenerEspecialidades"

  const buscar = useQuery(queryKey, ()=>{
    return EspecialidadesService.buscar("")
  }, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    // onSuccess: ({data})=>{
    //   props.onLoad && props.onLoad(data)
    // }
  })

  useEffect(()=>{
    if(buscar.data){
      props.onLoad && props.onLoad(buscar.data?.data)
    }
  }, [buscar.data])

  return <AsyncTypeahead
    positionFixed
    align="left"
    {...props}
    // filterBy={()=>true}
    isLoading={buscar.isFetching}
    options={buscar.data?.data || []}
    labelKey="nombre"
    useCache={false}
    minLength={0}
    onSearch={(newQuery)=>{
      // setOptions(buscar.data?.data.filter(r=>r.nombre.includes(newQuery))||[])
    }}
    renderMenuItemChildren={(prestacion) => {
      return prestacion.nombre
    }}
  />
}