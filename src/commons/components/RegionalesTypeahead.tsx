
import { useEffect, useMemo } from "react"
import { Button, Form, InputGroup } from "react-bootstrap"
import { Typeahead, TypeaheadProps } from 'react-bootstrap-typeahead'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { FaSync } from 'react-icons/fa'
import { useQuery } from 'react-query'
import { Regional, RegionalesService } from "../services/RegionalesService";
import { isMatch } from "../utils";
import 'react-bootstrap-typeahead/css/Typeahead.css';

export type { Regional }

type Props = {
  initialized?: boolean,
  feedback?: string,
  onLoad?: (options: Regional[])=>void
} & Omit<TypeaheadProps<Regional>, "isLoading" | "options" >

export const RegionalesTypeahead = ({initialized = true, isInvalid, feedback, filterBy, selected, ...props}: Props) => {
  const queryKey = "regionales.buscar"

  const buscar = useQuery(queryKey, ()=>{
    return RegionalesService.obtener()
  }, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })

  useEffect(()=>{
    if(buscar.data){
      props.onLoad && props.onLoad(buscar.data?.data)
    }
  }, [buscar.data, props.onLoad])

  const options = useMemo(()=>{
    if(Array.isArray(buscar.data?.data)){
        return buscar.data?.data!
    }
    else if(buscar.data?.data){
        console.error(buscar.data?.data)
    }
    return selected || []
  }, [buscar.data?.data])

  return initialized && (buscar.isError || buscar.isFetched) ? <InputGroup hasValidation className="position-unset" >
    <Typeahead
      clearButton
      emptyLabel="No se encontraron resultados"
      align="left"
      {...props}
      selected={options.filter(o => selected?.some(s => s.id == o.id))}
      className={`position-unset${(buscar.isError || isInvalid) ? " is-invalid" : ""}${props.className ? ` ${props.className}` : ""}`} 
      isInvalid={buscar.isError || isInvalid}
      filterBy={(regional, props)=>{
        return (!props.text || isMatch(regional.nombre, props)) 
          && (!filterBy || (typeof filterBy === "function" && filterBy(regional, props)))
      }}
      isLoading={buscar.isFetching}
      //@ts-ignore
      options={options}
      labelKey="nombre"
    />

    {buscar.isError ? <InputGroup.Append>
      <Button variant="outline-danger" onClick={()=>buscar.refetch()}><FaSync /></Button>
    </InputGroup.Append> : null}
    <Form.Control.Feedback type="invalid">{(buscar.error as any)?.response?.message || (buscar.error as any)?.message ||feedback}</Form.Control.Feedback>
  </InputGroup> : <Skeleton height="calc(1.5em + 0.75rem + 2px)" />
}